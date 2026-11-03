/*
Mojokerto Regency, Indonesia
Dynamic World V1, agricultural-to-built candidate conversion
Research configuration: MOJ_T60_BASE1719_END2325_PATCH5_8N_v1

RECONSTRUCTED SOURCE, NOT A VERBATIM COPY OF THE AUGUST 2026 SCRIPT.
This version assembles documented historical decisions into an inspectable
Google Earth Engine Code Editor workflow. See docs/PROVENANCE.md.

REQUIREMENT
Import the verified 304-village/urban-village FeatureCollection into the
GEE Code Editor and name it `table`, or specify ADMIN_ASSET below.
The source geometry must be consistent with the locked research dataset.

RUNNING
Set ACTIVE_STAGE to 1, 2, 3, 4, 5 or 6 and run stages in sequence.
Stage 3 exports the multi-threshold raster as an Earth Engine Asset.
Stages 4-6 read this Stage 3 Asset. Check its export has finished.
*/

var ACTIVE_STAGE = 1

// === Configure these values in your Earth Engine account ===
var ADMIN_ASSET = ''
var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var STAGE3_NEW_ASSET = ''  // Set to a NEW asset ID if exporting a rebuilt Stage 3
var STAGE6_NEW_ASSET = ''  // Optional, never overwrite a locked asset
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var NAME_DISTRICT = 'KECAMATAN'
var NAME_VILLAGE = 'DESAKEL'

// === Locked historic analytical configuration ===
var CONFIG_ID = 'MOJ_T60_BASE1719_END2325_PATCH5_8N_v1'
var DW_COLLECTION = 'GOOGLE/DYNAMICWORLD/V1'
var BASELINE_YEARS = [2017, 2018, 2019]
var END_YEARS = [2023, 2024, 2025]
var CROPS_LABEL = 4
var BUILT_LABEL = 6
var CROP_P75_MIN = 0.40
var CROP_FREQ_MIN = 0.20
var MIN_VALID_OBSERVATIONS = 5
var MIN_VALID_BASELINE_YEARS = 2
var MIN_PERSISTENCE_YEARS = 2
var MIN_VALID_END_YEARS = 3
var BUILT_THRESHOLDS = [0.50, 0.60, 0.70]
var PATCH_MIN_PIXELS = 5
var PATCH_MAXSIZE = 1024
var PATCH_EIGHT_CONNECTED = true
var SCALE = 10
var AREA_CRS = 'EPSG:32749'
var GRID_CRS = 'EPSG:32749'
var GRID_SCALE = 1000
var EXPECTED_LOCKED_AREA_HA = 323.3340607
var EXPECTED_NONZERO_VILLAGES = 230
var EXPECTED_ADMIN_UNITS = 304

if (ACTIVE_STAGE < 1 || ACTIVE_STAGE > 6) {
  throw new Error('ACTIVE_STAGE must be an integer from 1 to 6')
}

// The original working conversation imported village polygons as `table`.
// Leave ADMIN_ASSET empty only when `table` has been imported in Code Editor.
var admin = ADMIN_ASSET ? ee.FeatureCollection(ADMIN_ASSET) : table
var aoi = admin.geometry()
var dw = ee.ImageCollection(DW_COLLECTION).filterBounds(aoi)
var utm10 = ee.Projection(AREA_CRS).atScale(SCALE)

Map.centerObject(admin, 10)
Map.addLayer(admin.style({color: 'ffffff', fillColor: '00000000', width: 1}), {}, 'Administrative units', false)
print('Configuration', CONFIG_ID)
print('Administrative unit count, expected 304', admin.size())

function getYearCollection(year) {
  year = ee.Number(year)
  return dw.filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year.add(1), 1, 1))
}

function yearSummary(year, classBand, labelCode, name) {
  year = ee.Number(year)
  var collection = getYearCollection(year)
  var probability = collection.select(classBand)
  var validObs = probability.count().rename(name + '_count')
  var p75 = probability.reduce(ee.Reducer.percentile([75])).rename(name + '_p75')
  var labelMatches = collection.select('label').map(function (img) {
    return img.eq(labelCode).rename('match').copyProperties(img, ['system:time_start'])
  })
  var labelFreq = labelMatches.sum().divide(validObs.max(1)).rename(name + '_freq')
  var validYear = validObs.gte(MIN_VALID_OBSERVATIONS).rename(name + '_valid')
  return {
    count: validObs,
    p75: p75,
    freq: labelFreq,
    valid: validYear,
    year: year
  }
}

function cropYearStatus(year) {
  var y = yearSummary(year, 'crops', CROPS_LABEL, 'crop')
  return y.p75.gte(CROP_P75_MIN)
    .and(y.freq.gte(CROP_FREQ_MIN))
    .and(y.valid)
    .rename('crop_vote')
    .unmask(0)
    .toByte()
}

function baselineResult() {
  var annual = BASELINE_YEARS.map(cropYearStatus)
  var votes = ee.ImageCollection.fromImages(annual).sum().rename('crop_votes').toByte()
  var valid = ee.ImageCollection.fromImages(BASELINE_YEARS.map(function (y) {
    return yearSummary(y, 'crops', CROPS_LABEL, 'crop').valid.unmask(0).toByte()
  })).sum().rename('valid_years').toByte()
  var stable2 = votes.gte(MIN_PERSISTENCE_YEARS)
    .and(valid.gte(MIN_VALID_BASELINE_YEARS))
    .rename('stable2of3').toByte()
  var strict3 = votes.eq(3).and(valid.eq(3)).rename('strict3of3').toByte()
  return { votes: votes, validYears: valid, stable: stable2, strict: strict3 }
}

function persistentBuilt(years, threshold, requiredValidYears) {
  var annual = years.map(function (y) {
    var status = yearSummary(y, 'built', BUILT_LABEL, 'built')
    return status.p75.gte(threshold).and(status.valid).rename('built_year').unmask(0).toByte()
  })
  var votes = ee.ImageCollection.fromImages(annual).sum().rename('built_votes').toByte()
  var validYears = ee.ImageCollection.fromImages(years.map(function (y) {
    return yearSummary(y, 'built', BUILT_LABEL, 'built').valid.unmask(0).toByte()
  })).sum().rename('valid_built_years').toByte()
  return {
    votes: votes,
    valid: validYears,
    persistent: votes.gte(MIN_PERSISTENCE_YEARS).and(validYears.gte(requiredValidYears)),
    strict: votes.eq(3).and(validYears.eq(3))
  }
}

function buildConversionStack() {
  var cropBaseline = baselineResult().stable
  // Reconstructed baseline conflict screen: persistent existing built-up at T60.
  // The original exclusion implementation must be compared before an exact claim.
  var builtBaseline = persistentBuilt(BASELINE_YEARS, 0.60, 2).persistent
  var baselineClean = cropBaseline.and(builtBaseline.not()).rename('baseline_crop').toByte()

  var out = [baselineClean]
  BUILT_THRESHOLDS.forEach(function (t) {
    var suffix = String(Math.round(t * 100))
    var built = persistentBuilt(END_YEARS, t, MIN_VALID_END_YEARS)
    out.push(baselineClean.and(built.persistent).rename('conv_T' + suffix).toByte())
    out.push(baselineClean.and(built.strict).rename('strict_T' + suffix).toByte())
  })
  return ee.Image.cat(out).clip(aoi).set({configuration_id: CONFIG_ID})
}

function imageAreaHa(image, band) {
  return ee.Image.pixelArea().divide(10000).multiply(image.unmask(0))
    .rename(band).toDouble()
}

function regionalSum(image) {
  return image.reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, crs: AREA_CRS, scale: SCALE,
    maxPixels: 1e13, tileScale: 4
  })
}

function patchCount(binaryImage) {
  var binary = binaryImage.eq(1).selfMask()
  return binary.connectedPixelCount({maxSize: PATCH_MAXSIZE, eightConnected: PATCH_EIGHT_CONNECTED})
}

function patchRetained(binaryImage) {
  return binaryImage.eq(1).selfMask()
    .and(patchCount(binaryImage).gte(PATCH_MIN_PIXELS))
    .unmask(0).rename('retained').toByte().clip(aoi)
}

function patchToVectors(binaryImage, label) {
  var binary = binaryImage.eq(1).selfMask().toInt8()
  var stack = ee.Image.cat([
    binary.rename('patch_label'),
    ee.Image.constant(1).toInt8().updateMask(binary.mask()).rename('npx')
  ])
  return stack.reduceToVectors({
    geometry: aoi,
    geometryType: 'polygon',
    eightConnected: PATCH_EIGHT_CONNECTED,
    labelProperty: 'raster_code',
    reducer: ee.Reducer.sum(),
    crs: AREA_CRS,
    scale: SCALE,
    maxPixels: 1e13,
    tileScale: 4
  }).map(function (f) {
    return f.set({
      patch_pixels: f.get('sum'),
      patch_ha: f.geometry().area(1).divide(10000),
      source_group: label,
      configuration_id: CONFIG_ID
    })
  })
}

function makeGrid1km() {
  var proj = ee.Projection(GRID_CRS).atScale(GRID_SCALE)
  var coords = ee.Image.pixelCoordinates(proj)
  var gridCode = coords.select('x').add(10000).multiply(100000)
    .add(coords.select('y').add(10000)).toInt32().rename('grid_code')
  return gridCode.reduceToVectors({
    reducer: ee.Reducer.countEvery(), geometry: aoi,
    geometryType: 'polygon', crs: GRID_CRS, scale: GRID_SCALE,
    eightConnected: false, labelProperty: 'grid_id',
    maxPixels: 1e13, tileScale: 4
  }).map(function (f) {
    return f.set('grid_area_ha', f.geometry().area(1).divide(10000))
  })
}

function exportCSV(collection, name) {
  Export.table.toDrive({
    collection: collection, description: name,
    fileNamePrefix: name, fileFormat: 'CSV', folder: EXPORT_FOLDER
  })
}

function exportImageDrive(image, name) {
  Export.image.toDrive({
    image: image, description: name, fileNamePrefix: name,
    folder: EXPORT_FOLDER, region: aoi, scale: SCALE,
    crs: AREA_CRS, maxPixels: 1e13
  })
}

function countVillageStats(areaStack) {
  return areaStack.reduceRegions({
    collection: admin, reducer: ee.Reducer.sum(), crs: AREA_CRS,
    scale: SCALE, tileScale: 4
  }).map(function (f) {
    return f.set('config_id', CONFIG_ID)
  })
}

// ==================== STAGE 1 ====================
if (ACTIVE_STAGE === 1) {
  var coverageTable = ee.FeatureCollection(ee.List.sequence(2016, 2025).map(function (y) {
    var collection = getYearCollection(y)
    var validCount = collection.select('label').count()
    var stats = validCount.reduceRegion({
      reducer: ee.Reducer.mean(), geometry: aoi, scale: GRID_SCALE,
      crs: GRID_CRS, maxPixels: 1e13, tileScale: 4
    })
    return ee.Feature(null, {
      year: y,
      scene_count_intersecting_aoi: collection.size(),
      mean_valid_observations_per_pixel_1km_sample: stats.get('label'),
      configuration_id: CONFIG_ID
    })
  }))
  print('Annual Dynamic World coverage', coverageTable)
  exportCSV(coverageTable, 'Mojokerto_DW_Coverage_2016_2025')
}

// ==================== STAGE 2 ====================
if (ACTIVE_STAGE === 2) {
  var base = baselineResult()
  var baselineStack = ee.Image.cat([
    base.votes, base.validYears, base.stable, base.strict
  ]).toByte().clip(aoi)
  var summaryStage2 = ee.FeatureCollection(BASELINE_YEARS.map(function (y) {
    var crop = cropYearStatus(y)
    return ee.Feature(null, {
      year: y,
      area_ha: regionalSum(imageAreaHa(crop, 'crop_ha')).get('crop_ha'),
      configuration_id: CONFIG_ID
    })
  })).merge(ee.FeatureCollection([
    ee.Feature(null, {
      year: 'stable2of3',
      area_ha: regionalSum(imageAreaHa(base.stable, 'crop_ha')).get('crop_ha'),
      configuration_id: CONFIG_ID
    })
  ]))
  print('Stable baseline area, comparison target around 25694.64 ha', summaryStage2)
  Map.addLayer(base.stable.selfMask(), {palette: ['e4ae33']}, 'Baseline 2017-2019')
  exportCSV(summaryStage2, 'Mojokerto_Stage2_Baseline_Stability')
  exportImageDrive(baselineStack, 'Mojokerto_BaselineCrop_2017_2019')
}

// ==================== STAGE 3 ====================
if (ACTIVE_STAGE === 3) {
  var conversion = buildConversionStack()
  var preFilterAreaStack = ee.Image.cat(BUILT_THRESHOLDS.map(function (t) {
    var suffix = String(Math.round(t * 100))
    return imageAreaHa(conversion.select('conv_T' + suffix), 'area_T' + suffix)
  }))
  print('Unfiltered candidate area by threshold in ha', regionalSum(preFilterAreaStack))
  Map.addLayer(conversion.select('conv_T60').selfMask(), {palette: ['ff6933']}, 'T60 candidate')
  var areaValues = regionalSum(preFilterAreaStack)
  var summary = ee.FeatureCollection([ee.Feature(null, {
    area_T50_ha: areaValues.get('area_T50'),
    area_T60_ha: areaValues.get('area_T60'),
    area_T70_ha: areaValues.get('area_T70'),
    configuration_id: CONFIG_ID
  })])
  exportCSV(summary, 'Mojokerto_Stage3_PersistentBuilt_Threshold')
  exportImageDrive(conversion, 'Mojokerto_Stage3_ConversionStack')
  if (STAGE3_NEW_ASSET) {
    Export.image.toAsset({
      image: conversion.toByte(),
      description: 'Mojokerto_Stage3_ConversionMask_RECONSTRUCTED',
      assetId: STAGE3_NEW_ASSET,
      region: aoi, crs: AREA_CRS, scale: SCALE, maxPixels: 1e13
    })
  }
}

// ==================== STAGE 4 ====================
if (ACTIVE_STAGE === 4) {
  var stage3Stage4 = ee.Image(STAGE3_ASSET)
  var conv60Stage4 = stage3Stage4.select('conv_T60')
  var componentPixels = patchCount(conv60Stage4)
  var retained60 = patchRetained(conv60Stage4)
  var patches = patchToVectors(conv60Stage4, 'T60')
  var patchSummary = ee.FeatureCollection([
    ee.Feature(null, {
      stage: 'pre_filter',
      area_ha: regionalSum(imageAreaHa(conv60Stage4, 'area_ha')).get('area_ha'),
      patch_count: patches.size()
    }),
    ee.Feature(null, {
      stage: 'patch_gte5',
      area_ha: regionalSum(imageAreaHa(retained60, 'area_ha')).get('area_ha'),
      patch_count: patches.filter(ee.Filter.gte('patch_pixels', PATCH_MIN_PIXELS)).size()
    })
  ])
  var grid = makeGrid1km()
  var gridStats = imageAreaHa(retained60, 'conv_ha').reduceRegions({
    collection: grid, reducer: ee.Reducer.sum(),
    scale: SCALE, crs: AREA_CRS, tileScale: 4
  })
  print('Stage 4 patch statistics', patchSummary)
  print('Stage 4 grids', gridStats.size())
  Map.addLayer(retained60.selfMask(), {palette: ['ff4500']}, 'T60 patches >= 5 pixels')
  exportCSV(patchSummary, 'Mojokerto_Stage4_PatchGrid_Summary')
  Export.table.toDrive({collection: grid, description: 'Mojokerto_Stage4_Grid1km',
    fileNamePrefix: 'Mojokerto_Stage4_Grid1km', fileFormat: 'SHP', folder: EXPORT_FOLDER})
  exportCSV(gridStats, 'Mojokerto_Stage4_Grid1km_ConversionHa_RECONSTRUCTED')
  Export.table.toDrive({collection: patches, description: 'Mojokerto_Stage4_T60_Patches',
    fileNamePrefix: 'Mojokerto_Stage4_T60_Patches', fileFormat: 'SHP', folder: EXPORT_FOLDER})
  exportImageDrive(ee.Image.cat([retained60.rename('final_T60'), componentPixels.unmask(0).rename('component_n')]),
    'Mojokerto_Stage4_T60_Filtered_RECONSTRUCTED')
}

function numberedPatchSample(pool, nWanted, seed, prefix, groupName, confidence) {
  var sorted = ee.FeatureCollection(pool).randomColumn('random', seed).sort('random')
  var limitN = ee.Number(nWanted).min(sorted.size())
  var rows = sorted.limit(limitN).toList(limitN)
  return ee.FeatureCollection(ee.Algorithms.If(limitN.gt(0),
    ee.List.sequence(0, limitN.subtract(1)).map(function (i) {
      i = ee.Number(i)
      var patch = ee.Feature(rows.get(i))
      var centroid = patch.geometry().centroid(1).transform('EPSG:4326', 1)
      var lonlat = centroid.coordinates()
      return patch.set({
        QA_ID: ee.String(prefix).cat(i.add(1).format('%02d')),
        qa_group: groupName,
        confidence_group: confidence,
        patch_ha: patch.get('patch_ha'),
        centroid_lon: lonlat.get(0),
        centroid_lat: lonlat.get(1),
        validation_status: '',
        baseline_class: '',
        end_class: '',
        conversion_valid: '',
        conversion_extent: '',
        val_note: '',
        baseline_img_date: '',
        end_img_date: ''
      })
    }), ee.List([])))
}

// ==================== STAGE 5 ====================
if (ACTIVE_STAGE === 5) {
  var stage3Stage5 = ee.Image(STAGE3_ASSET)
  var t50 = stage3Stage5.select('conv_T50')
  var t60 = stage3Stage5.select('conv_T60')
  var t70 = stage3Stage5.select('conv_T70')
  // Group identities and seeds are historically recorded.
  // These reconstructed pool definitions may differ from original patch IDs.
  var poolA = patchToVectors(patchRetained(t70), 'A_T70_ROBUST')
  var poolB = patchToVectors(patchRetained(t60.and(t70.not())), 'B_T60_ONLY_ROBUST')
  var poolC = patchToVectors(t60.and(patchCount(t60).lt(PATCH_MIN_PIXELS)), 'C_T60_SMALL')
  var poolD = patchToVectors(patchRetained(t50.and(t60.not())), 'D_T50_ONLY_ROBUST')
  var qaA = numberedPatchSample(poolA, 20, 1701, 'A', 'A_T70_ROBUST', 'HIGH')
  var qaB = numberedPatchSample(poolB, 20, 1702, 'B', 'B_T60_ONLY_ROBUST', 'MEDIUM_HIGH')
  var qaC = numberedPatchSample(poolC, 10, 1703, 'C', 'C_T60_SMALL', 'SMALL_PATCH')
  var qaD = numberedPatchSample(poolD, 10, 1704, 'D', 'D_T50_ONLY_ROBUST', 'LOWER_THRESHOLD')
  var qaPatches = qaA.merge(qaB).merge(qaC).merge(qaD)
  var qaPoints = qaPatches.map(function (f) {
    return ee.Feature(f.geometry().centroid(1).transform('EPSG:4326', 1), f.toDictionary())
  })
  print('Total reconstructed QA point count, target 60', qaPoints.size())
  print('Sample pools A/B/C/D', poolA.size(), poolB.size(), poolC.size(), poolD.size())
  Map.addLayer(qaPoints.style({color: '00ddee', pointSize: 4}), {}, 'QA sample points')
  exportCSV(qaPoints, 'Mojokerto_Stage5_QA60_Points_RECONSTRUCTED')
  Export.table.toDrive({collection: qaPatches, description: 'Mojokerto_Stage5_QA60_Patches_RECONSTRUCTED',
    fileNamePrefix: 'Mojokerto_Stage5_QA60_Patches_RECONSTRUCTED',
    fileFormat: 'SHP', folder: EXPORT_FOLDER})
  // The original validated 60-point CSV is preserved in data_reference.
  // No omission error can be calculated from change patches alone.
}

// ==================== STAGE 6 ====================
if (ACTIVE_STAGE === 6) {
  var stage3Stage6 = ee.Image(STAGE3_ASSET)
  var finalConv = patchRetained(stage3Stage6.select('conv_T60'))
    .rename('final_conv').toByte()
  var areaFinal = imageAreaHa(finalConv, 'conv_ha')
  var summaryPerVillage = countVillageStats(areaFinal)
  var totalArea = regionalSum(areaFinal).get('conv_ha')
  var numNonzero = summaryPerVillage.filter(ee.Filter.gt('conv_ha', 0)).size()
  var audit = ee.FeatureCollection([ee.Feature(null, {
    config_id: CONFIG_ID,
    reconstructed_area_ha: totalArea,
    historical_admin_locked_area_ha: EXPECTED_LOCKED_AREA_HA,
    area_difference_ha: ee.Number(totalArea).subtract(EXPECTED_LOCKED_AREA_HA),
    computed_villages_with_conversion: numNonzero,
    historical_villages_with_conversion: EXPECTED_NONZERO_VILLAGES,
    computed_admin_units: admin.size(),
    expected_admin_units: EXPECTED_ADMIN_UNITS
  })])
  print('Stage 6 lock audit. Differences require methodological investigation', audit)
  print('Stage 6 village outputs', summaryPerVillage.limit(5))
  Map.addLayer(finalConv.selfMask(), {palette: ['ee3300']}, 'Stage 6 locked T60 >=5')
  exportCSV(summaryPerVillage, 'Mojokerto_Stage6_Conversion_by_Desa_RECONSTRUCTED')
  exportCSV(audit, 'Mojokerto_Stage6_ProductionLock_QC_RECONSTRUCTED')
  exportImageDrive(finalConv, 'Mojokerto_Stage6_T60_Patch5_RECONSTRUCTED')
  if (STAGE6_NEW_ASSET) {
    Export.image.toAsset({
      image: finalConv,
      description: 'Mojokerto_Stage6_T60_ReconstructedAsset',
      assetId: STAGE6_NEW_ASSET,
      region: aoi, scale: SCALE, crs: AREA_CRS, maxPixels: 1e13
    })
  }
}