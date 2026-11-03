/*
Read-only Stage 0 diagnostic for Kabupaten Mojokerto.
Open in Google Earth Engine Code Editor with access to the original legacy research assets.
Does not export, overwrite, or claim historical re-execution.

Set ADMIN_ASSET or import the historically used FeatureCollection as table.
Set STAGE3_ASSET only after checking the original image in the Asset Manager.
Set LOCKED_STAGE6_ASSET only if the original archived raster is independently verified.
*/
var ADMIN_ASSET = ''
var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var LOCKED_STAGE6_ASSET = ''
var CHECK_STAGE3 = false
var CHECK_LOCKED_PIXELS = false

var DISTRICT_FIELD = 'KECAMATAN'
var VILLAGE_FIELD = 'DESAKEL'
var AREA_CRS = 'EPSG:32749'
var SCALE = 10
var EXPECTED_T60_HA = 323.33406072288363
var EXPECTED_NONZERO = 230
var EXPECTED_ADMIN_FEATURES = 304
var EXPECTED_DISTRICTS = 18
var EXPECTED_BOUNDARY_AREA_KM2 = 984.2492023190476

var importedTable = (typeof table !== 'undefined') ? ee.FeatureCollection(table) : null
var admin = ADMIN_ASSET ? ee.FeatureCollection(ADMIN_ASSET) : importedTable

print('READ-ONLY preflight: no export tasks are defined')
print('Historical references: 304 units, 230 conversion-positive units, T60 ha', EXPECTED_T60_HA)
if (!admin) {
  print('BLOCKED: specify verified ADMIN_ASSET or import original administrative table')
} else {
  var complete = admin.filter(ee.Filter.notNull([DISTRICT_FIELD, VILLAGE_FIELD]))
  var keyed = complete.map(function (f) {
    var k = ee.String(f.get(DISTRICT_FIELD)).cat('|').cat(ee.String(f.get(VILLAGE_FIELD)))
    return f.set('verify_key', k)
  })
  print('Polygon features', admin.size())
  print('Expected features', EXPECTED_ADMIN_FEATURES)
  print('Distinct kecamatan', admin.aggregate_array(DISTRICT_FIELD).distinct().size())
  print('Expected kecamatan', EXPECTED_DISTRICTS)
  print('Boundary source field frequencies', admin.aggregate_histogram('SUMBER'))
  print('Input boundary area in km2 (Earth Engine geometry)', admin.geometry().area(1).divide(1e6))
  print('Reference offline boundary area km2', EXPECTED_BOUNDARY_AREA_KM2)
  print('Note: GEE geometry area can differ slightly from planar source area')
  print('Features with complete names', complete.size())
  print('Distinct district-village keys', keyed.distinct(['verify_key']).size())
  print('First feature, inspect attributes', admin.first())
  var aoi = admin.geometry()
  var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterBounds(aoi)
  var years = [2017, 2018, 2019, 2023, 2024, 2025]
  var coverage = ee.FeatureCollection(years.map(function (y) {
    return ee.Feature(null, {
      year: y,
      intersecting_images: dw.filterDate(y + '-01-01', (y + 1) + '-01-01').size()
    })
  }))
  print('Annual scene coverage, not per-pixel validity', coverage)
  if (CHECK_STAGE3) {
    if (!STAGE3_ASSET) {
      throw new Error('Provide a verified original Stage 3 image asset ID')
    }
    var stage3 = ee.Image(STAGE3_ASSET)
    print('Stage 3 bands', stage3.bandNames())
    print('Stage 3 T60 projection', stage3.select('conv_T60').projection())
    var candidate = stage3.select('conv_T60').eq(1).selfMask()
    var components = candidate.connectedPixelCount({maxSize: 1024, eightConnected: true})
    var retained = candidate.and(components.gte(5)).unmask(0).rename('final_conv').toByte().clip(aoi)
    var areaImage = ee.Image.pixelArea().divide(10000).multiply(retained).rename('conv_ha')
    var total = ee.Number(areaImage.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi, scale: SCALE, crs: AREA_CRS,
      maxPixels: 1e13, tileScale: 4
    }).get('conv_ha'))
    print('Recomputed T60 area ha', total)
    print('Difference from historical T60 ha', total.subtract(EXPECTED_T60_HA))
    var polygons = areaImage.reduceRegions({
      collection: admin, reducer: ee.Reducer.sum(),
      scale: SCALE, crs: AREA_CRS, tileScale: 4
    })
    print('Positive polygon features, aggregate multipart keys when needed',
      polygons.filter(ee.Filter.gt('conv_ha', 0)).size())
    print('Expected distinct positive units', EXPECTED_NONZERO)
    Map.addLayer(retained.selfMask(), {palette: ['ff4500']}, 'Stage 6 T60 diagnostic', false)
    if (CHECK_LOCKED_PIXELS) {
      if (!LOCKED_STAGE6_ASSET) {
        throw new Error('Provide independently verified historical Stage 6 raster ID')
      }
      var original = ee.Image(LOCKED_STAGE6_ASSET).select(0).gt(0).unmask(0)
      print('Historical raster projection', original.projection())
      var diff = retained.neq(original).toByte().rename('mismatched_pixels')
      print('Pixel differences evaluated on historical raster projection',
        diff.reduceRegion({
          reducer: ee.Reducer.sum(), geometry: aoi,
          crs: original.projection(), maxPixels: 1e13, tileScale: 4
        }))
      print('Inspect pixel origin, masks and resampling before claiming perfect raster identity')
    }
  } else {
    print('Stage 3 tests disabled until GEE asset access has been verified')
  }
}
