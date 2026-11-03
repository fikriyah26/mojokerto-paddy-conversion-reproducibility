/*
Read-only verification: historical Stage 3 -> reconstructed Stage 6 T60.
Research asset: users/fikriiyah26/Mojokerto_Stage3_ConversionMask
Requires imported administrative table as `table` in the GEE Code Editor.
No exports, task submission, or asset modification.
*/

var admin = ee.FeatureCollection(table)
var stage3 = ee.Image('users/fikriiyah26/Mojokerto_Stage3_ConversionMask')
var threshold = 5
var sourceCRS = 'EPSG:32749'
var targetAreaHa = 323.33406072288363
var targetPositiveUnits = 230
var RUN_UNIT_CHECK = false // Set true after area check, can be more costly

// The archival source can contain 308 polygon pieces for 304 logical units.
var keyedAdmin = admin.map(function (f) {
  var key = ee.String(f.get('KECAMATAN'))
    .cat('|').cat(ee.String(f.get('DESAKEL')))
  return f.set('unit_key', key)
})
print('Source polygon count (304 or 308 possible)', keyedAdmin.size())
print('Distinct district-village units, expected 304',
  keyedAdmin.distinct(['unit_key']).size())
print('District count, expected 18',
  keyedAdmin.aggregate_array('KECAMATAN').distinct().size())

var aoi = admin.geometry()
var conv = stage3.select('conv_T60').eq(1).selfMask()
var connected = conv.connectedPixelCount({
  maxSize: 1024,
  eightConnected: true
})
var retained = conv.and(connected.gte(threshold))
  .unmask(0).rename('retained_T60').toByte().clip(aoi)

function areaImage(mask, name) {
  return ee.Image.pixelArea().divide(10000)
    .multiply(mask.unmask(0)).rename(name).toDouble()
}
function sumArea(image, name) {
  return ee.Number(image.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    crs: sourceCRS,
    scale: 10,
    maxPixels: 1e13,
    tileScale: 8
  }).get(name))
}
var beforeArea = areaImage(conv, 'before_ha')
var afterArea = areaImage(retained, 'after_ha')
var before = sumArea(beforeArea, 'before_ha')
var after = sumArea(afterArea, 'after_ha')

print('Stage 3 pre-filter candidate area (ha)', before)
print('Stage 6 filtered T60 area (ha)', after)
print('Historical Stage 6 reference (ha)', targetAreaHa)
print('Difference, reconstructed minus historical (ha)',
  after.subtract(targetAreaHa))

// With multipart polygons, count distinct keys after computing positive area.
// Do not count 308 polygon parts as 308 villages.
// Optional second phase, because 308 polygon reductions can be costly.
if (RUN_UNIT_CHECK) {
var byPolygon = afterArea.reduceRegions({
  collection: keyedAdmin,
  reducer: ee.Reducer.sum(),
  crs: sourceCRS,
  scale: 10,
  tileScale: 8
})
var positives = byPolygon.filter(ee.Filter.gt('sum', 0))
var distinctPositives = positives.distinct(['unit_key'])
print('Positive polygon parts', positives.size())
print('Positive distinct administrative units', distinctPositives.size())
print('Historical positive distinct units', targetPositiveUnits)
print('Difference in number of positive distinct units',
  distinctPositives.size().subtract(targetPositiveUnits))
} else {
  print('Positive-unit test deferred: set RUN_UNIT_CHECK = true after area comparison')
}

print('Stage 3 T60 raster CRS', stage3.select('conv_T60').projection().crs())
print('Stage 3 T60 transform', stage3.select('conv_T60').projection().transform())
Map.centerObject(admin, 10)
Map.addLayer(conv, {palette: ['fbbf24']}, 'T60 before patch filter', false)
Map.addLayer(retained.selfMask(), {palette: ['ea580c']},
  'T60 retained patches >= 5 pixels', false)

print('No exports were created. Keep all source assets unchanged.')
