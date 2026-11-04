/*
STAGE 8: T50 and T70 sensitivity rerun, first as a single-district test.

Data provenance:
  Stage 3 historical multi-threshold asset
    users/fikriiyah26/Mojokerto_Stage3_ConversionMask
  Original locked Stage 6 T60 image and original raster grid
    users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1
  Original 308-piece administrative FeatureCollection imported as table

Locked grid reconstruction protocol verified for T60:
  1. Reproject Stage 3 binary candidates to locked native grid.
  2. Apply 5-pixel 8-connected component filter.
  3. Compute pixelArea / 10000 with updateMask on each binary mask.
  4. Use weighted ee.Reducer.sum() on native locked grid.
  5. The FOUR-band reduceRegions result uses band-named output properties.

The original Stage 6 T60 image is a separate positive control, NOT a
historical T50 or T70 locked image. Those sensitivity masks are REBUILT.
There is no historical final T50/T70 image in the verified asset listing.

FIRST run: BATCH_START=8, BATCH_COUNT=1 for Kecamatan Kutorejo.
Archived reference in Kecamatan Kutorejo (17 units):
  T50 = 55.51071220490999 ha, 17 positive units
  T60 = 27.63093313694076 ha, 16 positive units
  T70 =  5.867751710013591 ha, 10 positive units

DO NOT run all 18 districts until the pilot CSV is compared with the
historical 17-unit archive and all three thresholds pass.

After pilot success, BATCH_START 0,3,6,9,12,15 and BATCH_COUNT 3.
If needed set BATCH_COUNT 1. CSVs go only to Drive.
NO GEE image or table assets are overwritten or exported.
*/

var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var LOCKED_T60_ASSET =
  'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var BATCH_START = 8
var BATCH_COUNT = 1
var PATCH_MIN_PIXELS = 5
var PATCH_MAX_SIZE = 1024
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
  throw new Error('Import the ORIGINAL 308-piece admin collection as table')
}

// Compatible with the JavaScript runtime in GEE Code Editor.
function isWholeNumber(x) {
  return typeof x === 'number' && isFinite(x) && x % 1 === 0
}
if (!isWholeNumber(BATCH_START) || !isWholeNumber(BATCH_COUNT) ||
    BATCH_START < 0 || BATCH_COUNT < 1 ||
    BATCH_START + BATCH_COUNT > DISTRICTS.length) {
  throw new Error('Invalid batch start or batch count')
}

var admin = ee.FeatureCollection(table)
var lockedImage = ee.Image(LOCKED_T60_ASSET).select('final_conv')
var nativeProjection = lockedImage.projection()
var stage3 = ee.Image(STAGE3_ASSET)

print('STAGE 8 PILOT: T50 AND T70 ALIGNED TO LOCKED T60 GRID')
print('Stage 3 source', STAGE3_ASSET)
print('Stage 3 bands', stage3.bandNames())
print('Locked T60 asset', LOCKED_T60_ASSET)
print('Locked image native CRS', nativeProjection.crs())
print('Locked image native affine', nativeProjection.transform())
print('Expected EPSG:3857 affine [10,0,12504720,0,-10,-815190]')
print('Original polygon-part count, expected 308', admin.size())
print('Pilot expected Kecamatan Kutorejo T50/T60/T70 ha',
  55.51071220490999, 27.63093313694076, 5.867751710013591)

// Align candidates BEFORE connected components. Do not use UTM grid here.
function rebuiltThreshold(band) {
  var binaryAligned = stage3.select(band).eq(1)
    .unmask(0).toByte()
    .reproject({crs: nativeProjection})

  var connected = binaryAligned.selfMask().connectedPixelCount({
    maxSize: PATCH_MAX_SIZE,
    eightConnected: true
  })
  return binaryAligned.selfMask()
    .and(connected.gte(PATCH_MIN_PIXELS))
    .unmask(0).toByte()
}

var reconstructed50 = rebuiltThreshold('conv_T50')
var reconstructed60 = rebuiltThreshold('conv_T60')
var reconstructed70 = rebuiltThreshold('conv_T70')
var locked60 = lockedImage.gt(0)
  .unmask(0).toByte().reproject({crs: nativeProjection})

// IMPORTANT: updateMask, not multiplication by a 0-filled mask,
// preserves the weighted boundary pixel behavior of the historical export.
function hectares(binary, outputBand) {
  return ee.Image.pixelArea().divide(10000)
    .updateMask(binary.eq(1).selfMask())
    .rename(outputBand).toDouble()
}

var areas = ee.Image.cat([
  hectares(reconstructed50, 'area_T50_ha'),
  hectares(reconstructed60, 'area_T60_rebuilt_ha'),
  hectares(locked60, 'area_T60_locked_ha'),
  hectares(reconstructed70, 'area_T70_ha')
])

print('Reduction output band names', areas.bandNames())

function valueOrZeroAndFlag(f, name) {
  var raw = f.get(name)
  var missing = ee.Algorithms.IsEqual(raw, null)
  return {
    value: ee.Number(ee.Algorithms.If(missing, 0, raw)),
    flag: ee.Number(ee.Algorithms.If(missing, 1, 0))
  }
}

function exportRow(f) {
  var a50 = valueOrZeroAndFlag(f, 'area_T50_ha')
  var a60 = valueOrZeroAndFlag(f, 'area_T60_rebuilt_ha')
  var l60 = valueOrZeroAndFlag(f, 'area_T60_locked_ha')
  var a70 = valueOrZeroAndFlag(f, 'area_T70_ha')
  return ee.Feature(null, {
    KECAMATAN: f.get('KECAMATAN'),
    DESAKEL: f.get('DESAKEL'),
    area_T50_ha: a50.value,
    area_T60_rebuilt_ha: a60.value,
    area_T60_locked_ha: l60.value,
    area_T70_ha: a70.value,
    missing_T50: a50.flag,
    missing_T60_rebuilt: a60.flag,
    missing_T60_locked: l60.flag,
    missing_T70: a70.flag
  })
}

var stop = BATCH_START + BATCH_COUNT
for (var i = BATCH_START; i < stop; i++) {
  var district = DISTRICTS[i]
  var sourcePieces = admin.filter(ee.Filter.eq('KECAMATAN', district))
  var zonal = areas.reduceRegions({
    collection: sourcePieces,
    reducer: ee.Reducer.sum(),
    crs: nativeProjection,
    tileScale: TILE_SCALE
  })
  var output = zonal.map(exportRow)
  var index = ('0' + (i + 1)).slice(-2)
  var exportName = 'Mojokerto_Stage8_ThresholdGrid_' +
    index + '_' + district.replace('Kecamatan ', '')

  Export.table.toDrive({
    collection: output,
    folder: EXPORT_FOLDER,
    description: exportName,
    fileNamePrefix: exportName,
    fileFormat: 'CSV',
    selectors: [
      'KECAMATAN', 'DESAKEL',
      'area_T50_ha', 'area_T60_rebuilt_ha',
      'area_T60_locked_ha', 'area_T70_ha',
      'missing_T50', 'missing_T60_rebuilt',
      'missing_T60_locked', 'missing_T70'
    ]
  })
}
print('Created CSV Task(s) for', DISTRICTS.slice(BATCH_START, stop))
print('No source images, tables or historical GEE assets are modified.')
print('Pilot first: compare every Kutorejo village before 18 district export.')
