/*
Stage 7 weighted-area corrective test: ONE district only
Compares the original locked Stage 6 image with archived village benchmarks.
Avoids ambiguous output property names from single-band reduceRegions.
Instead each village's reduceRegion returns an explicit named dictionary key.
A CSV export task is prepared but NOT started automatically.

Import the original 308-part administrative collection as table.
Only 17 original polygon parts of Kecamatan Kutorejo will be processed.
No asset writes.
*/

var LOCKED_ASSET =
  'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var FOLDER = 'Mojokerto_GEE_Research'
var DISTRICT = 'Kecamatan Kutorejo'

var locked = ee.Image(LOCKED_ASSET).select('final_conv')
var nativeProjection = locked.projection()
var admin = ee.FeatureCollection(table)
var districtParts = admin.filter(ee.Filter.eq('KECAMATAN', DISTRICT))

// A zero-valued, valid background gives explicit numeric 0 to units with
// no mapped conversion instead of a missing reducer output.
var binary = locked.eq(1).unmask(0).toByte()
var hectareArea = ee.Image.pixelArea().divide(10000)
  .multiply(binary).rename('area_T60_ha').toDouble()

function calculatePart(part) {
  var dict = hectareArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: part.geometry(),
    crs: nativeProjection,
    maxPixels: 1e9,
    tileScale: 16
  })
  return ee.Feature(null, {
    KECAMATAN: part.get('KECAMATAN'),
    DESAKEL: part.get('DESAKEL'),
    area_T60_ha: dict.get('area_T60_ha')
  })
}

var result = districtParts.map(calculatePart)
var benchmark = 7.383299456212667
var sample = ee.Feature(
  result.filter(ee.Filter.eq('DESAKEL', 'Pesanggrahan')).first()
)
var testArea = sample.get('area_T60_ha')

print('STAGE 7 CORRECTIVE TEST, ORIGINAL STAGE 6 IMAGE')
print('Source locked band', locked.bandNames())
print('Native projection CRS', nativeProjection.crs())
print('Native affine', nativeProjection.transform())
print('District parts expected 17', districtParts.size())
print('Sample district-village', DISTRICT, 'Pesanggrahan')
print('KNOWN HISTORICAL SAMPLE AREA HA', benchmark)
print('FRESH GEE SAMPLE AREA HA', testArea)
print('SAMPLE DIFFERENCE HA', ee.Number(testArea).subtract(benchmark))
print('SAMPLE OUTPUT PROPERTIES', sample.propertyNames())
print('First five result rows', result.limit(5))
print('IMPORTANT: Confirm numeric output and small delta before starting Task')

Export.table.toDrive({
  collection: result,
  description: 'Mojokerto_Stage7_WeightedFix_Test_09_Kutorejo',
  folder: FOLDER,
  fileNamePrefix: 'Mojokerto_Stage7_WeightedFix_Test_09_Kutorejo',
  fileFormat: 'CSV',
  selectors: ['KECAMATAN', 'DESAKEL', 'area_T60_ha']
})
