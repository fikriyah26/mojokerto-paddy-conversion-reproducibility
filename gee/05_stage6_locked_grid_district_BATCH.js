/*
Experimental pixel-grid comparison, original locked Stage 6 vs Stage 3 T60.
Requires verified locked Stage 6 IMAGE asset and imported table.
Source rasters are never altered. One district batch CSV.
*/
var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var LOCKED_STAGE6_ASSET = '' // Fill after finding historical IMAGE or private TIFF import
var DISTRICT = 'Kecamatan Kutorejo'
var GRID_CRS = 'EPSG:3857'
var GRID = [10, 0, 12504720, 0, -10, -815190]
var MIN_PATCH = 5
var PATCH_MAXSIZE = 1024
var MAKE_TASK = true

if (!LOCKED_STAGE6_ASSET) {
  print('STOP: locked Stage 6 Image asset not identified. No task created.')
  print('Run 04_inventory_historical_locked_assets_READ_ONLY.js first.')
  print('Otherwise privately import the archived locked GeoTIFF as a NEW asset.')
} else {
  var lockedImage = ee.Image(LOCKED_STAGE6_ASSET).select(0)
  print('Reference asset', LOCKED_STAGE6_ASSET)
  print('Imported image projection', lockedImage.projection())
  print('Imported image affine', lockedImage.projection().transform())
  print('Expected archival grid', GRID_CRS, GRID)
  print('If affine differs, do NOT claim pixel-level identity.')

  var districtPolygons = ee.FeatureCollection(table)
    .filter(ee.Filter.eq('KECAMATAN', DISTRICT))
  var roi = districtPolygons.geometry()
  print('District polygon pieces', districtPolygons.size())

  // Original Stage 3 grid was EPSG:4326. Force candidate onto locked grid first.
  // This is a deliberate sensitivity test, NOT a historical replay.
  var lockedGrid = ee.Projection(GRID_CRS, GRID)
  var locked = lockedImage.gt(0).unmask(0).toByte()
    .reproject({crs: lockedGrid})
  var candidate = ee.Image(STAGE3_ASSET).select('conv_T60')
    .eq(1).unmask(0).toByte().reproject({crs: lockedGrid})
  var components = candidate.selfMask().connectedPixelCount({
    maxSize: PATCH_MAXSIZE, eightConnected: true
  })
  var rebuilt = candidate.selfMask().and(components.gte(MIN_PATCH))
    .unmask(0).toByte()

  var mismatch = locked.neq(rebuilt)
  var rebuiltOnly = rebuilt.eq(1).and(locked.eq(0))
  var lockedOnly = locked.eq(1).and(rebuilt.eq(0))
  var area = ee.Image.pixelArea().divide(10000)
  var resultDictionary = ee.Image.cat([
    locked.rename('locked_pixels'),
    rebuilt.rename('rebuilt_pixels'),
    mismatch.toByte().rename('mismatch_pixels'),
    area.multiply(locked).rename('locked_ha'),
    area.multiply(rebuilt).rename('rebuilt_ha'),
    area.multiply(mismatch).rename('mismatch_ha'),
    area.multiply(rebuiltOnly).rename('rebuilt_only_ha'),
    area.multiply(lockedOnly).rename('locked_only_ha')
  ]).reduceRegion({
    reducer: ee.Reducer.sum().unweighted(),
    geometry: roi,
    crs: GRID_CRS,
    crsTransform: GRID,
    maxPixels: 1e13,
    tileScale: 8
  })
  var row = ee.Feature(null, resultDictionary).set({
    district: DISTRICT,
    stage3_asset: STAGE3_ASSET,
    locked_asset: LOCKED_STAGE6_ASSET,
    test_type: 'regrid_candidate_before_patch_filter',
    min_patch_pixels: MIN_PATCH,
    max_connected_pixels: PATCH_MAXSIZE,
    eight_connected: 1,
    grid_crs: GRID_CRS,
    grid_transform: GRID.join(','),
    offline_reference_locked_pixels: 2830,
    offline_reference_locked_ha: 27.630283184373937
  })
  if (MAKE_TASK) {
    Export.table.toDrive({
      collection: ee.FeatureCollection([row]),
      description: 'Mojokerto_Stage6_Grid_QC_Kutorejo',
      folder: 'Mojokerto_GEE_Research',
      fileNamePrefix: 'Mojokerto_Stage6_Grid_QC_Kutorejo',
      fileFormat: 'CSV'
    })
    print('One batch CSV Task created. Start in Tasks.')
  }
  print('Experimental grid comparison; not an exact historical Stage 4 rerun.')
}
