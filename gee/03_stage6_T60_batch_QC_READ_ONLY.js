/*
Kabupaten Mojokerto, Stage 6 T60 historical asset verification
Batch table export for long-running pixel operations after Code Editor timeout.
Original input: users/fikriiyah26/Mojokerto_Stage3_ConversionMask
Import historical admin as 'table' (308 polygon parts, 304 unique units).
Read-only source assets, export only one CSV to Google Drive.
*/
var HISTORICAL_STAGE3 = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var EXPECTED_FINAL_HA = 323.33406072288363
var OBSERVED_PREFILTER_HA = 332.3841543521087
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'

var admin = ee.FeatureCollection(table)
var areaOfInterest = admin.geometry()
var stage3 = ee.Image(HISTORICAL_STAGE3)
var candidateT60 = stage3.select('conv_T60').eq(1).selfMask()

// Keep historical reconstructed Stage 6 patch settings unchanged.
var patchPixels = candidateT60.connectedPixelCount({
  maxSize: 1024,
  eightConnected: true
})
var filteredT60 = candidateT60
  .and(patchPixels.gte(5))
  .unmask(0)
  .rename('retained_T60')
  .toByte()
  .clip(areaOfInterest)

function hectaresFromMask(binary, name) {
  return ee.Image.pixelArea()
    .divide(10000)
    .multiply(binary.unmask(0))
    .rename(name)
    .toDouble()
}
function sumHa(mask, name) {
  return ee.Number(hectaresFromMask(mask, name).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    crs: 'EPSG:32749',
    scale: 10,
    maxPixels: 1e13,
    tileScale: 8
  }).get(name))
}
// Lazy values are calculated by batch export instead of interactive print.
var beforeHa = sumHa(candidateT60, 'candidate_area_ha')
var afterHa = sumHa(filteredT60, 'retained_area_ha')
var results = ee.FeatureCollection([
  ee.Feature(null, {
    stage3_asset: HISTORICAL_STAGE3,
    calculation: 'Stage6_T60_patch5_eightConnected',
    input_polygon_parts: 308,
    expected_distinct_units: 304,
    candidate_area_ha: beforeHa,
    observed_prefilter_area_ha: OBSERVED_PREFILTER_HA,
    candidate_area_delta_ha: beforeHa.subtract(OBSERVED_PREFILTER_HA),
    retained_area_ha: afterHa,
    historical_area_ha: EXPECTED_FINAL_HA,
    area_delta_ha: afterHa.subtract(EXPECTED_FINAL_HA),
    removed_area_ha: beforeHa.subtract(afterHa),
    connected_max_size: 1024,
    minimum_patch_pixels: 5,
    eight_connected: 1,
    reducer_crs: 'EPSG:32749',
    reducer_scale_m: 10,
    historical_stage3_crs: 'EPSG:4326'
  })
])
Export.table.toDrive({
  collection: results,
  description: 'Mojokerto_Stage6_T60_Batch_QC_Patch5',
  folder: EXPORT_FOLDER,
  fileNamePrefix: 'Mojokerto_Stage6_T60_Batch_QC_Patch5',
  fileFormat: 'CSV'
})
print('Batch CSV export prepared. Open Tasks and click Run.')
print('No historical asset is modified. Do not print calculated areas.')
