/*
Diagnose why fresh Stage 7 weighted values differ from historical ones
in five villages of Kecamatan Kutorejo even though Pesanggrahan matches.

Uses ORIGINAL locked Stage 6 Image and the 308-part source admin table.
Runs three reducer variants without changing native raster grid.
No asset write. Creates one optional 6-row diagnostic CSV task.

Source:
  users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1
*/
var LOCKED_ASSET =
  'projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1'
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var EXPORT_DIAGNOSTIC = true

var historical = ee.Dictionary({
  Kepuhpandak: 1.427440736742207,
  Windurejo: 0.4655677938274307,
  Wonodadi: 2.316863789137298,
  Kaligoro: 1.755481434347115,
  Kepuharum: 0.5226339882794547,
  Pesanggrahan: 7.383299456212667
})
var names = historical.keys()
var locked = ee.Image(LOCKED_ASSET).select('final_conv')
var nativeProjection = locked.projection()
var villages = ee.FeatureCollection(table)
  .filter(ee.Filter.eq('KECAMATAN', 'Kecamatan Kutorejo'))
  .filter(ee.Filter.inList('DESAKEL', names))

var binaryMasked = locked.eq(1).selfMask()
var maskedArea = ee.Image.pixelArea().divide(10000)
  .updateMask(binaryMasked).rename('area_T60_ha').toDouble()

// Alternative representation: original source values multiplied by a
// full-validity 0/1 mask. This differs from updateMask on boundary pixels.
var zeroFilledArea = ee.Image.pixelArea().divide(10000)
  .multiply(locked.eq(1).unmask(0).toByte())
  .rename('area_T60_ha').toDouble()

// Diagnostic control preserving the original multiband Stage 7 interface.
// Values of the dummy bands are deliberately the same as T60.
// Only the area_T60_ha output is assessed.
var threeBandArea = ee.Image.cat([
  maskedArea.rename('dummy_area_T50'),
  maskedArea,
  maskedArea.rename('dummy_area_T70')
])

var singleRegion = maskedArea.reduceRegions({
  collection: villages,
  reducer: ee.Reducer.sum(),
  crs: nativeProjection,
  tileScale: 16
})
var multiRegion = threeBandArea.reduceRegions({
  collection: villages,
  reducer: ee.Reducer.sum(),
  crs: nativeProjection,
  tileScale: 16
})

print('STAGE 7 DIAGNOSTIC, SIX VILLAGES WITH HISTORICAL REFERENCES')
print('Source image', LOCKED_ASSET)
print('Native source CRS', nativeProjection.crs())
print('Native source transform', nativeProjection.transform())
print('Expected village features', villages.size())
print('Single band reduceRegions output keys',
  ee.Feature(singleRegion.first()).propertyNames())
print('Three band reduceRegions output keys',
  ee.Feature(multiRegion.first()).propertyNames())

var result = villages.map(function(f) {
  var desa = ee.String(f.get('DESAKEL'))
  var hist = ee.Number(historical.get(desa))
  var directMasked = ee.Number(maskedArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: f.geometry(),
    crs: nativeProjection,
    maxPixels: 1e9,
    tileScale: 16
  }).get('area_T60_ha'))
  var directZero = ee.Number(zeroFilledArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: f.geometry(),
    crs: nativeProjection,
    maxPixels: 1e9,
    tileScale: 16
  }).get('area_T60_ha'))
  var single = ee.Feature(singleRegion
    .filter(ee.Filter.eq('DESAKEL', desa)).first())
  var multi = ee.Feature(multiRegion
    .filter(ee.Filter.eq('DESAKEL', desa)).first())

  return ee.Feature(null, {
    KECAMATAN: 'Kecamatan Kutorejo',
    DESAKEL: desa,
    historical_ha: hist,
    direct_masked_ha: directMasked,
    direct_zero_filled_ha: directZero,
    single_region_field_sum: single.get('sum'),
    single_region_field_area: single.get('area_T60_ha'),
    three_band_field_area: multi.get('area_T60_ha'),
    delta_direct_masked_ha: directMasked.subtract(hist),
    delta_direct_zero_filled_ha: directZero.subtract(hist)
  })
})

print('Compare the six test villages', result)
print('If historical values differ, do NOT expand all 18 districts yet')

if (EXPORT_DIAGNOSTIC) {
  Export.table.toDrive({
    collection: result,
    description: 'Mojokerto_Stage7_Weighted_Methods_QC_Kutorejo',
    fileNamePrefix: 'Mojokerto_Stage7_Weighted_Methods_QC_Kutorejo',
    folder: EXPORT_FOLDER,
    fileFormat: 'CSV',
    selectors: [
      'KECAMATAN', 'DESAKEL', 'historical_ha',
      'direct_masked_ha', 'direct_zero_filled_ha',
      'single_region_field_sum', 'single_region_field_area',
      'three_band_field_area',
      'delta_direct_masked_ha', 'delta_direct_zero_filled_ha'
    ]
  })
  print('Diagnostic CSV task prepared in Tasks, no asset modified')
}
