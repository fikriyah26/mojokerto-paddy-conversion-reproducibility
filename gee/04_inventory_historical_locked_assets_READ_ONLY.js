/*
Read-only inventory of original GEE legacy assets under users/fikriiyah26.
Print the full name and type of each candidate individually.
No exports, no asset writes, no automatic selection of a historical raster.
*/
var ROOT = 'users/fikriiyah26'
var inventory = ee.data.listAssets(ROOT)
var all = inventory.assets || []

print('Original legacy owner', ROOT)
print('Root asset count', all.length)
print('Root asset names', all.map(function (asset) {
  return (asset.name || '') + ' [' + (asset.type || 'unknown') + ']'
}))

var candidates = all.filter(function (asset) {
  return /stage.?6|stage.?3|final|locked|conversion|t60|mask/i.test(asset.name || '')
})
print('Number of matching candidate assets', candidates.length)

candidates.forEach(function (asset, index) {
  var id = asset.name
  print('CANDIDATE ' + (index + 1) + ' FULL NAME', id)
  print('CANDIDATE ' + (index + 1) + ' TYPE', asset.type)
  if (asset.type === 'IMAGE') {
    var raster = ee.Image(id)
    print('CANDIDATE ' + (index + 1) + ' BANDS', raster.bandNames())
    print('CANDIDATE ' + (index + 1) + ' PROJECTION',
      raster.select(0).projection())
    print('CANDIDATE ' + (index + 1) + ' TRANSFORM',
      raster.select(0).projection().transform())
  } else if (asset.type === 'FOLDER') {
    print('CANDIDATE ' + (index + 1) + ' IS A FOLDER: inspect its children')
  }
})

print('Archived locked GeoTIFF expected CRS', 'EPSG:3857')
print('Archived locked GeoTIFF expected affine',
  [10, 0, 12504720, 0, -10, -815190])
print('DO NOT infer image identity from its name, projection or size alone')
print('If no matching historical IMAGE exists, privately ingest the archived TIFF')
