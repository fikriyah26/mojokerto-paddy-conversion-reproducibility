/*
Inventory ORIGINAL legacy GEE assets, no exports and no writes.
Research owner: users/fikriiyah26
*/
var LEGACY_ROOT = 'users/fikriiyah26';
var HISTORICAL_STAGE3 = LEGACY_ROOT + '/Mojokerto_Stage3_ConversionMask';

print('Original legacy owner', LEGACY_ROOT);
try {
  var inventory = ee.data.listAssets(LEGACY_ROOT);
  print('Legacy asset listing', inventory);
  var candidates = (inventory.assets || []).filter(function(asset) {
    return /stage.?6|final|locked|conversion/i.test(asset.name || '');
  });
  print('Potential historical Stage 6 images', candidates);
} catch(error) {
  print('Legacy folder listing unavailable', String(error));
  print('Use Assets panel to inspect the original legacy folder');
}

var possibleIds = [
  LEGACY_ROOT + '/Mojokerto_Final_Conversion_Mask_Locked',
  LEGACY_ROOT + '/Mojokerto_Stage6_Final_Conversion_Mask',
  LEGACY_ROOT + '/Mojokerto_Stage6_T60_Patch5'
];

possibleIds.forEach(function(assetId) {
  try {
    var metadata = ee.data.getAsset(assetId);
    print('ASSET FOUND', assetId, metadata.type);
    if (metadata.type === 'IMAGE') {
      var img = ee.Image(assetId);
      print('Bands', assetId, img.bandNames());
      print('Projection', assetId, img.select(0).projection());
      print('Transform', assetId, img.select(0).projection().transform());
    }
  } catch(error) {
    print('No accessible image at ' + assetId, String(error));
  }
});
print('Stage 3 bands', ee.Image(HISTORICAL_STAGE3).bandNames());
print('LOCKED TIFF expected CRS: EPSG:3857');
print('LOCKED TIFF expected affine: [10,0,12504720,0,-10,-815190]');
print('A matching filename alone does not prove identical raster content.');
