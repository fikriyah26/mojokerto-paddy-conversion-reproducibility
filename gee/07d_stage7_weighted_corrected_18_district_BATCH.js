/*
Stage 7 VERIFIED MASK AND REDUCER PROPERTY CORRECTION
Historical locked Stage 6 T60 weighted-area exports, 18 districts.

The user-run six-village diagnostic 07c confirmed:
- updateMask(locked.eq(1).selfMask()) matches archived Stage 7 areas
- zero-filled mask multiplied into pixelArea does NOT match for 5/6 test units
- SINGLE-BAND ee.Image.reduceRegions with ee.Reducer.sum() names the
  output property 'sum', NOT 'area_T60_ha'.

This script retains the verified masked input and reads 'sum'.
It does not change any image or administrative asset, only exports Drive CSV.

TEST FIRST: BATCH_START = 8, BATCH_COUNT = 1 for Kecamatan Kutorejo.
Compare its 17 rows against archived 17 rows.
Then run BATCH_START = 0, 3, 6, 9, 12, 15 with BATCH_COUNT = 3.
Do not combine the test and full exports when checking completion.
*/
var LOCKED_ASSET =
  'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var BATCH_START = 8
var BATCH_COUNT = 1
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
  throw new Error('Import the original 308-polygon boundaries as table')
}
// GEE Code Editor can use an older JavaScript runtime without Number.isInteger.
function isWholeNumber(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    value % 1 === 0
}
if (!isWholeNumber(BATCH_START) || !isWholeNumber(BATCH_COUNT) ||
    BATCH_START < 0 || BATCH_COUNT < 1 ||
    BATCH_START + BATCH_COUNT > DISTRICTS.length) {
  throw new Error('Invalid BATCH_START or BATCH_COUNT')
}

var admin = ee.FeatureCollection(table)
var locked = ee.Image(LOCKED_ASSET).select('final_conv')
var nativeProjection = locked.projection()

// Preserve conversion-pixel mask. Do NOT unmask(0) before area reduction.
var areaImage = ee.Image.pixelArea().divide(10000)
  .updateMask(locked.eq(1).selfMask())
  .rename('area_T60_ha')
  .toDouble()

print('Source locked Stage 6', LOCKED_ASSET)
print('Native CRS', nativeProjection.crs())
print('Native affine', nativeProjection.transform())
print('Expected 308 original administrative polygons', admin.size())
print('Expected 304 distinct village keys')
print('Batch start', BATCH_START, 'batch count', BATCH_COUNT)

// A single-band sum reducer gives property 'sum' for reduceRegions,
// verified empirically in 07c. Masked areas can return null for units
// with no positive pixels. Preserve that diagnostic in raw_sum_missing.
function asExportRow(f) {
  var raw = f.get('sum')
  var missing = ee.Algorithms.IsEqual(raw, null)
  return ee.Feature(null, {
    KECAMATAN: f.get('KECAMATAN'),
    DESAKEL: f.get('DESAKEL'),
    area_T60_ha: ee.Number(ee.Algorithms.If(missing, 0, raw)),
    raw_sum_missing: ee.Number(ee.Algorithms.If(missing, 1, 0))
  })
}

var stop = BATCH_START + BATCH_COUNT
for (var i = BATCH_START; i < stop; i++) {
  var district = DISTRICTS[i]
  var pieces = admin.filter(ee.Filter.eq('KECAMATAN', district))

  var reduced = areaImage.reduceRegions({
    collection: pieces,
    reducer: ee.Reducer.sum(),
    crs: nativeProjection,
    tileScale: TILE_SCALE
  })

  var exported = reduced.map(asExportRow)
  var number = ('0' + (i + 1)).slice(-2)
  var desc = 'Mojokerto_Stage7_WeightedCorrected_' +
    number + '_' + district.replace('Kecamatan ', '')

  Export.table.toDrive({
    collection: exported,
    description: desc,
    fileNamePrefix: desc,
    folder: EXPORT_FOLDER,
    fileFormat: 'CSV',
    selectors: ['KECAMATAN', 'DESAKEL', 'area_T60_ha', 'raw_sum_missing']
  })
}
print('Export Task(s) prepared for',
  DISTRICTS.slice(BATCH_START, stop))
print('Masked pixels retained, sum reducer property read as sum')
print('No historical asset is modified')
print('Compare all 304 keys, 230 positive units, and 323.33406072288363 ha')
