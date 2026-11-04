/*
DEPRECATED HISTORICAL DIAGNOSTIC - DO NOT USE FOR NEW EXPORTS.
Author-run batch returned 308 blank area values.
The single-band reducer exposes 'sum', not 'area_T60_ha'.
Use gee/07d_stage7_weighted_corrected_18_district_BATCH.js
which preserves updateMask and reads the correct 'sum' field.
This superseded source is preserved to document the failed test.
*/

/*
Stage 7 verification of Stage 6 historical T60 area by village.
Source is the ACTUAL locked Stage 6 GEE image, not reconstructed Stage 3.
Each GEE export contains original polygon parts for one district.
Batch 3 districts at a time. Merge the 308 polygon parts to 304
district-village units OFFLINE, to avoid a large server-side dissolve.
No source asset is modified. Only Drive CSV export tasks are prepared.

Use BATCH_START = 0, 3, 6, 9, 12, 15 with BATCH_COUNT = 3.
If a batch fails, set BATCH_COUNT = 1 for that district.

Important methodological distinction:
  ee.Reducer.sum() is weighted by the fractional pixel coverage.
  Do not use ee.Reducer.sum().unweighted(), which was used solely
  for the preceding pixel-centre mask comparison.
*/

var ADMIN_FIELD_DISTRICT = 'KECAMATAN'
var ADMIN_FIELD_VILLAGE = 'DESAKEL'
var LOCKED_ASSET = 'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var BATCH_START = 0
var BATCH_COUNT = 3
var TILE_SCALE = 16

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

if (typeof table === 'undefined') {
  throw new Error('Import the original 308-polygon admin FeatureCollection as table')
}
if (BATCH_START < 0 || BATCH_START >= DISTRICTS.length ||
    BATCH_COUNT < 1 || BATCH_START + BATCH_COUNT > DISTRICTS.length) {
  throw new Error('Check BATCH_START and BATCH_COUNT')
}

var admin = ee.FeatureCollection(table)
var historicalLocked = ee.Image(LOCKED_ASSET).select('final_conv')
var sourceProjection = historicalLocked.projection()
var positiveMask = historicalLocked.eq(1).selfMask()

// This follows the original Stage 7 low-memory area calculation.
// Pixel area is geodesic and the reducer uses partial-pixel weights.
var areaImage = ee.Image.pixelArea()
  .divide(10000)
  .updateMask(positiveMask)
  .rename('area_T60_ha')
  .toDouble()

print('Historical locked source', LOCKED_ASSET)
print('Native image CRS', sourceProjection.crs())
print('Native image affine transform', sourceProjection.transform())
print('Input administrative polygon features, expected 308', admin.size())
print('Batch indices', BATCH_START, BATCH_COUNT)

var stop = BATCH_START + BATCH_COUNT
for (var i = BATCH_START; i < stop; i++) {
  var district = DISTRICTS[i]
  var originalPolygons = admin.filter(
    ee.Filter.eq(ADMIN_FIELD_DISTRICT, district)
  )

  var reduced = areaImage.reduceRegions({
    collection: originalPolygons,
    reducer: ee.Reducer.sum(),
    crs: sourceProjection,
    tileScale: TILE_SCALE
  })

  var rows = reduced.map(function (f) {
    return ee.Feature(null, {
      KECAMATAN: f.get(ADMIN_FIELD_DISTRICT),
      DESAKEL: f.get(ADMIN_FIELD_VILLAGE),
      area_T60_ha: f.get('area_T60_ha')
    })
  })

  var number = ('0' + (i + 1)).slice(-2)
  var exportName = 'Mojokerto_Stage6_VillageWeighted_' +
    number + '_' + district.replace('Kecamatan ', '')

  Export.table.toDrive({
    collection: rows,
    description: exportName,
    folder: EXPORT_FOLDER,
    fileNamePrefix: exportName,
    fileFormat: 'CSV',
    selectors: ['KECAMATAN', 'DESAKEL', 'area_T60_ha']
  })
}

print('Prepared Drive exports for districts',
  DISTRICTS.slice(BATCH_START, stop))
print('No image or table asset is changed')
print('After 18 exports, combine four multipart units by district and village key')
print('Reference: 304 unique units, 230 positive units, 323.33406072288363 ha')
