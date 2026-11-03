/*
ADDITIONAL REVIEWER ANALYSIS, NOT PART OF HISTORICAL 2026 GEE CODE.
Stratified independent sample design for map-error evaluation.
DO NOT FILL reference labels from Dynamic World. They need independent visual
interpretation of baseline and end-period imagery.
Exports (1) survey points (2) population area weights (ha) by map stratum.
*/
var ADMIN_ASSET = ''
var STAGE3_ASSET = 'users/YOUR_GEE_USERNAME/Mojokerto_Stage3_ConversionMask'
var EXPORT_FOLDER = 'Mojokerto_GEE_Research'
var admin = ADMIN_ASSET ? ee.FeatureCollection(ADMIN_ASSET) : table
var aoi = admin.geometry()
var img = ee.Image(STAGE3_ASSET)
var crop = img.select('baseline_crop').eq(1)
var t60 = img.select('conv_T60').eq(1).selfMask()
var pixelCount = t60.connectedPixelCount({maxSize: 1024, eightConnected: true})
var retained = t60.and(pixelCount.gte(5)).unmask(0).eq(1)
// 1 = mapped change, 2 = baseline agricultural candidate with no mapped change,
// 3 = other map non-change area. These are mapped classes, not reference labels.
var strata = ee.Image.constant(3).where(crop, 2).where(retained, 1)
  .rename('mapped_stratum').toByte().clip(aoi)
var SAMPLING_SEED = 20261025
var N_PER_STRATUM = 100
var projection = ee.Projection('EPSG:32749').atScale(10)
var samples = strata.stratifiedSample({
  numPoints: 0, classBand: 'mapped_stratum', classValues: [1, 2, 3],
  classPoints: [N_PER_STRATUM, N_PER_STRATUM, N_PER_STRATUM],
  region: aoi, projection: projection, scale: 10, seed: SAMPLING_SEED,
  geometries: true, tileScale: 4, dropNulls: true
}).randomColumn('random_id', SAMPLING_SEED).map(function (f) {
  var xy = f.geometry().transform('EPSG:4326', 1).coordinates()
  return f.set({
    point_id: ee.String('QA_').cat(ee.Number(f.get('mapped_stratum')).format('%d'))
      .cat('_').cat(ee.Number(f.get('random_id')).multiply(1e9).round().format('%09d')),
    longitude: xy.get(0), latitude: xy.get(1),
    reference_change: '', reference_baseline_paddy: '', reference_end_built: '',
    baseline_image_date: '', end_image_date: '', reviewer_notes: ''
  })
})
var stratumArea = ee.Image.pixelArea().divide(10000).rename('area_ha')
  .addBands(strata).reduceRegion({
    reducer: ee.Reducer.sum().group({groupField: 1, groupName: 'mapped_stratum'}),
    geometry: aoi, projection: projection, scale: 10, maxPixels: 1e13, tileScale: 4
  })
var stratumTable = ee.FeatureCollection(ee.List(stratumArea.get('groups')).map(function (item) {
  item = ee.Dictionary(item)
  return ee.Feature(null, {mapped_stratum: item.get('mapped_stratum'),
    area_ha: item.get('sum')})
}))
print('Independent sample counts by stratum', samples.aggregate_histogram('mapped_stratum'))
print('Mapped stratum area ha', stratumTable)
Export.table.toDrive({collection: samples, description: 'Mojokerto_Stage8_Independent_Reference_Samples',
  fileNamePrefix: 'Mojokerto_Stage8_Independent_Reference_Samples',
  folder: EXPORT_FOLDER, fileFormat: 'CSV'})
Export.table.toDrive({collection: stratumTable, description: 'Mojokerto_Stage8_Map_Stratum_Area',
  fileNamePrefix: 'Mojokerto_Stage8_Map_Stratum_Area',
  folder: EXPORT_FOLDER, fileFormat: 'CSV'})
Map.centerObject(admin, 10)
Map.addLayer(strata, {min: 1, max: 3, palette: ['cc3300','ffcc00','9aa1ab']},
  'Mapped strata for reference sample', false)
Map.addLayer(samples, {color:'ffffff'}, 'Independent reference samples')