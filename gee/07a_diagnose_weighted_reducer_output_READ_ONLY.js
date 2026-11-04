/*
Stage 7 weighted-area CSV column diagnostic
Read-only: prints the property names actually emitted by ee.Image.reduceRegions.
Use the original 308-part administrative table imported as `table`.
Only one known-positive village in Kecamatan Kutorejo is tested.
There are no export tasks and no asset writes.
*/
var LOCKED = 'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var locked = ee.Image(LOCKED).select('final_conv')
var proj = locked.projection()
var village = ee.FeatureCollection(table)
  .filter(ee.Filter.eq('KECAMATAN', 'Kecamatan Kutorejo'))
  .filter(ee.Filter.eq('DESAKEL', 'Pesanggrahan'))

var area = ee.Image.pixelArea().divide(10000)
  .updateMask(locked.eq(1).selfMask())
  .rename('area_T60_ha')
  .toDouble()

print('Known-positive reference village: Kecamatan Kutorejo / Pesanggrahan')
print('Historical Stage 7 weighted area reference (ha)', 7.383299456212667)
print('Selected administrative feature count', village.size())
print('Native locked projection', proj)

var one = area.reduceRegions({
  collection: village,
  reducer: ee.Reducer.sum(),
  crs: proj,
  tileScale: 16
})
print('SINGLE-BAND reducer output property names',
  ee.Feature(one.first()).propertyNames())
print('SINGLE-BAND first full feature', one.first())
print('SINGLE-BAND field area_T60_ha', ee.Feature(one.first()).get('area_T60_ha'))
print('SINGLE-BAND field sum', ee.Feature(one.first()).get('sum'))

var twoBand = area.addBands(area.rename('area_control_ha'))
var two = twoBand.reduceRegions({
  collection: village,
  reducer: ee.Reducer.sum(),
  crs: proj,
  tileScale: 16
})
print('TWO-BAND reducer output property names',
  ee.Feature(two.first()).propertyNames())
print('TWO-BAND field area_T60_ha',
  ee.Feature(two.first()).get('area_T60_ha'))
print('TWO-BAND control area_control_ha',
  ee.Feature(two.first()).get('area_control_ha'))

print('Direct weighted reduceRegion result', area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: village.geometry(),
  crs: proj,
  maxPixels: 1e9,
  tileScale: 16
}))

print('End. No export task created.')
