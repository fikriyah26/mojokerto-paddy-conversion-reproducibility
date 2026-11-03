/*
Verifikasi aset historis Stage 3, Kabupaten Mojokerto.
Sumber analisis asli menggunakan ruang legacy users/fikriiyah26.
READ-ONLY: tidak ada Export, Task baru, atau penimpaan aset.
Impor batas administrasi sebagai 'table' bila ingin melihat lokasi.
*/

var STAGE3_ASSET = 'users/fikriiyah26/Mojokerto_Stage3_ConversionMask'
var stage3 = ee.Image(STAGE3_ASSET)

print('ID ASET HISTORIS STAGE 3', STAGE3_ASSET)
print('SEMUA BAND STAGE 3', stage3.bandNames())
print('JUMLAH BAND', stage3.bandNames().size())
print('BAND WAJIB T50, T60, T70',
  ['conv_T50', 'conv_T60', 'conv_T70'])
print('BAND YANG BELUM ADA',
  ee.List(['conv_T50', 'conv_T60', 'conv_T70'])
    .removeAll(stage3.bandNames()))
print('PROYEKSI BAND PERTAMA', stage3.select(0).projection())
print('SKALA NOMINAL BAND PERTAMA (m)',
  stage3.select(0).projection().nominalScale())

try {
  var metadata = ee.data.getAsset(STAGE3_ASSET)
  print('TIPE ASET HISTORIS', metadata.type)
  print('METADATA ASET', metadata)
} catch (error) {
  print('METADATA TIDAK TERBACA',
    String(error))
}

if (typeof table !== 'undefined') {
  var admin = ee.FeatureCollection(table)
  print('JUMLAH UNIT ADMINISTRASI', admin.size())
  Map.centerObject(admin, 10)
  Map.addLayer(admin.style({
    color: 'ffffff', fillColor: '00000000', width: 1
  }), {}, 'Batas administrasi 304 unit', false)
  Map.addLayer(
    stage3.select('conv_T60').selfMask().clip(admin.geometry()),
    {palette: ['f97316']},
    'Stage 3 T60 sebelum filter patch', false
  )
} else {
  print('OPSIONAL: impor batas administrasi sebagai table')
}

print('CATATAN: Stage 3 adalah kandidat sebelum filter patch 5 piksel.')
print('Angka pembanding 323,3341 ha berlaku untuk keluaran akhir Stage 6.')
