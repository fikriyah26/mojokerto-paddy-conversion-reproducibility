/*
Tahap berikutnya: inventaris aset Stage 3
Read-only. Tidak membuat Tasks atau Export.
Proyek aktif: project-fikriyah
*/
var projectRoot = 'projects/project-fikriyah/assets'
var adminAsset = projectRoot + '/Mojokerto_Admin_RTRW_304_for_GEE'
var legacyStage3 = 'users/fikriyah26/Mojokerto_Stage3_ConversionMask'

var rootInfo = ee.data.listAssets(projectRoot)
print('DAFTAR ASET CLOUD PROJECT', rootInfo)

var sourceInfo = ee.data.getAsset(adminAsset)
print('ASET ADMIN YANG SUDAH DIPERIKSA', sourceInfo.name, sourceInfo.type)

var assets = rootInfo.assets || []
var images = assets.filter(function(a) {
  return a.type === 'IMAGE'
})
print('JUMLAH IMAGE ASSET DI FOLDER UTAMA', images.length)
print('DAFTAR IMAGE ASSET', images)

var stage3Candidates = assets.filter(function(a) {
  return /stage.?3|conversion|mask/i.test(a.name || '')
})
print('KANDIDAT ASET STAGE 3 PADA ROOT', stage3Candidates)

try {
  var oldAsset = ee.data.getAsset(legacyStage3)
  print('ASET LEGACY TERCATAT', oldAsset.name, oldAsset.type)
  if (oldAsset.type === 'IMAGE') {
    print('BAND ASET LEGACY', ee.Image(legacyStage3).bandNames())
  }
} catch (error) {
  print('ASET LEGACY TIDAK DAPAT DIAKSES', String(error))
}
print('BAND YANG DIPERLUKAN', ['conv_T50', 'conv_T60', 'conv_T70'])
print('CATATAN', 'Jika hanya muncul batas administrasi, Stage 3 belum tersedia sebagai aset pada project root')
