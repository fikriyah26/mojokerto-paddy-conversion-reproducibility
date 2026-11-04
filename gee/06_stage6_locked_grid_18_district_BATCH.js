/*
Stage 6 historical mask versus Stage 3 T60, all 18 districts.
Same read-only pixel-grid comparison tested successfully in Kecamatan Kutorejo.
Only derived CSV files are exported to Drive. Never overwrites Earth Engine assets.

Run BATCH_START = 0, 3, 6, 9, 12, 15 in six Code Editor runs.
Each run creates up to 3 export tasks. Execute tasks in the GEE Tasks panel.
Keep BATCH_COUNT=1 if a district task is too expensive.
*/

var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var LOCKED_ASSET = 'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var FOLDER = 'Mojokerto_GEE_Research'
var GRID_CRS = 'EPSG:3857'
var GRID = [10, 0, 12504720, 0, -10, -815190]
var BATCH_START = 0
var BATCH_COUNT = 3
var PATCH_MAXSIZE = 1024
var PATCH_MIN_PIXELS = 5

var DISTRICTS = [
  'Kecamatan Bangsal',
  'Kecamatan Dawarblandong',
  'Kecamatan Dlanggu',
  'Kecamatan Gedeg',
  'Kecamatan Gondang',
  'Kecamatan Jatirejo',
  'Kecamatan Jetis',
  'Kecamatan Kemlagi',
  'Kecamatan Kutorejo',
  'Kecamatan Mojoanyar',
  'Kecamatan Mojosari',
  'Kecamatan Ngoro',
  'Kecamatan Pacet',
  'Kecamatan Pungging',
  'Kecamatan Puri',
  'Kecamatan Sooko',
  'Kecamatan Trawas',
  'Kecamatan Trowulan'
]

var admin = ee.FeatureCollection(table)
var lockedImage = ee.Image(LOCKED_ASSET).select('final_conv')
var lockedGrid = lockedImage.projection()

print('Locked image CRS', lockedGrid.crs())
print('Locked image transform', lockedGrid.transform())
print('Expected CRS and transform', GRID_CRS, GRID)
print('Input feature count (308 original or 304 dissolved)', admin.size())
print('Batch indices', BATCH_START, BATCH_COUNT)

var locked = lockedImage.gt(0).unmask(0).toByte()
  .reproject({crs: lockedGrid})

var stage3T60 = ee.Image(STAGE3_ASSET).select('conv_T60')
  .eq(1).unmask(0).toByte().reproject({crs: lockedGrid})

var componentPixels = stage3T60.selfMask().connectedPixelCount({
  maxSize: PATCH_MAXSIZE,
  eightConnected: true
})

var rebuilt = stage3T60.selfMask()
  .and(componentPixels.gte(PATCH_MIN_PIXELS))
  .unmask(0).toByte()

var mismatch = locked.neq(rebuilt).toByte()
var rebuiltOnly = rebuilt.eq(1).and(locked.eq(0)).toByte()
var lockedOnly = locked.eq(1).and(rebuilt.eq(0)).toByte()
var pixelAreaHa = ee.Image.pixelArea().divide(10000)

var metrics = ee.Image.cat([
  locked.rename('locked_pixels'),
  rebuilt.rename('rebuilt_pixels'),
  mismatch.rename('mismatch_pixels'),
  rebuiltOnly.rename('rebuilt_only_pixels'),
  lockedOnly.rename('locked_only_pixels'),
  pixelAreaHa.multiply(locked).rename('locked_ha'),
  pixelAreaHa.multiply(rebuilt).rename('rebuilt_ha'),
  pixelAreaHa.multiply(mismatch).rename('mismatch_ha'),
  pixelAreaHa.multiply(rebuiltOnly).rename('rebuilt_only_ha'),
  pixelAreaHa.multiply(lockedOnly).rename('locked_only_ha')
])

var stop = Math.min(DISTRICTS.length, BATCH_START + BATCH_COUNT)
for (var i = BATCH_START; i < stop; i++) {
  var district = DISTRICTS[i]
  var region = admin.filter(ee.Filter.eq('KECAMATAN', district))
  var results = metrics.reduceRegion({
    reducer: ee.Reducer.sum().unweighted(),
    geometry: region.geometry(),
    crs: GRID_CRS,
    crsTransform: GRID,
    maxPixels: 1e13,
    tileScale: 8
  })
  var row = ee.Feature(null, results).set({
    district: district,
    original_admin_parts: region.size(),
    locked_asset: LOCKED_ASSET,
    stage3_asset: STAGE3_ASSET,
    test_type: 'regrid_candidate_before_patch_filter',
    grid_crs: GRID_CRS,
    grid_transform: GRID.join(','),
    patch_maxsize: PATCH_MAXSIZE,
    min_patch_pixels: PATCH_MIN_PIXELS,
    eight_connected: 1
  })
  var suffix = ('0' + (i + 1)).slice(-2)
  var name = 'Mojokerto_Stage6_GridQC_' + suffix + '_' +
    district.replace('Kecamatan ', '')
  Export.table.toDrive({
    collection: ee.FeatureCollection([row]),
    description: name,
    folder: FOLDER,
    fileNamePrefix: name,
    fileFormat: 'CSV'
  })
}

print('Export tasks prepared for districts', DISTRICTS.slice(BATCH_START, stop))
print('No research asset is modified.')
print('Zero mismatched pixel centres in all districts will support grid-based')
print('pixel identity within administrative areas, not a proven historical')
print('replay of the complete Stage 1 to Stage 6 classification process.')
