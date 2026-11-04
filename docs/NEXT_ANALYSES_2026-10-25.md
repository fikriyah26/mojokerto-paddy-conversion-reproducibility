# Tindak lanjut reviewer berdasarkan verifikasi data 25 Oktober tahun 2026

## 1. Sampel validasi historis, analisis telah dihitung

Sumber: `data_reference/Mojokerto_Stage5_QA60_Points_revised.csv`.

| Kelompok | Sampel terkonfirmasi | Proporsi | Interval Wilson 95 persen |
|---|---:|---:|---:|
| A, T70 robust | 18/20 | 90% | 69,90 sampai 97,21 persen |
| B, T60-only robust | 17/20 | 85% | 63,96 sampai 94,76 persen |
| C, T60 small patches | 7/10 | 70% | 39,68 sampai 89,22 persen |
| D, T50-only robust | 5/10 | 50% | 23,66 sampai 76,34 persen |
| A + B, sampel utama | 35/40 | 87,5% | 73,89 sampai 94,54 persen |

**Hasil penting:** tujuh dari sepuluh kelompok perubahan kecil yang diperiksa secara historis terbukti merupakan perubahan nyata. Penghapusan patch kurang dari lima piksel berpotensi menghilangkan sejumlah perubahan yang benar-benar terjadi. Hasil tersebut bukan estimasi omission error berbasis luas, karena kelompok sampelnya diambil dari kandidat perubahan, bukan sampel acak dari keseluruhan kelas perubahan dan tidak berubah.

Kelompok D memberikan indikasi trade-off probabilitas rendah: lima dari sepuluh kandidat T50-only terkonfirmasi. Angka tersebut bukan precision wilayah keseluruhan ambang T50.

Data contoh di bawah `tests` seluruhnya **SINTETIS** untuk menguji rumus. Jangan digunakan sebagai angka penelitian.

## 2. Omission error, belum dapat dihitung

Skrip `gee/08_omission_sampling_design_ADDITION.js` mengekspor calon sampel acak pada tiga strata dan luas strata sebagai bobot. Titik hasil ekspor perlu diinterpretasi secara independen menggunakan citra historis dan diberi kolom `reference_change` 0 atau 1. Setelah itu gunakan `tools/compute_area_adjusted_error.py`. Jangan menghitung omission error dari QA60 historis, karena tidak menyediakan sampel representatif kelas tanpa perubahan.

## 3. Sensitivitas 0,50 dan 0,70, luas pascapenyaringan belum tersedia

Arsip mendokumentasikan luas kandidat sebelum penyaringan: T50 628,63 ha, T60 331,99 ha, T70 92,00 ha. Tahap 6 pada T60 memberikan 323,3340607 ha. Tidak ada CSV raster pascapenyaringan T50 atau T70 yang diverifikasi sebagai hasil eksekusi baru. Skrip `gee/07_optional_threshold_sensitivity_ADDITION.js` menyiapkan penghitungan luas baru. `tools/compute_threshold_economics.py` akan menolak penghitungan total jika hasil T50 menyertakan desa di luar 230 unit yang telah memiliki koefisien intensitas hasil model.

## 4. Parameter produktivitas tingkat kecamatan

Arsip menghasilkan `RICE_INT` untuk 230 desa dan kelurahan yang terkonversi dengan parameter produktivitas GKG tingkat kabupaten. Data GKG tingkat kecamatan yang sebanding belum tersedia untuk seluruh 18 kecamatan. Jangan menafsirkan CI sebagai produktivitas per hektare panen. Analisis dengan produktivitas tingkat kecamatan belum dijalankan.

## 5. Sumber batas administrasi

Arsip 304 poligon dan 230 poligon berformat shapefile EPSG:32749 tersedia, tetapi identitas penerbit dan lisensi data geometri tidak terbukti hanya dari PRJ. Repositori ini hanya menyertakan atribut data turunan, bukan shapefile geometri, menunggu penetapan hak distribusi.

## 6. Status eksekusi untuk GitHub

* Verifikasi ulang total arsip Stage 6: berhasil.
* Eksekusi ulang Stage 1 sampai 6 di server Earth Engine: **belum diamati atau diverifikasi**.
* Raster baru T50 dan T70: **belum tersedia**.
* Omission error: **belum tersedia**.
* Semua data sampel baru yang belum diinterpretasikan tidak boleh diklaim sebagai hasil validasi.

## Pembaruan status per 4 November 2026

Pernyataan sebelumnya mengenai belum tersedianya perhitungan ulang T50 dan T70 mencerminkan kondisi tanggal 25 Oktober 2026. Pengujian berikutnya telah berhasil dilakukan:

- Rekonstruksi Stage 3 ke raster T60 historis pada grid EPSG:3857 menghasilkan nol piksel berbeda pada pusat piksel di 18 kecamatan.
- Perhitungan ulang luas berbobot T60 langsung dari raster Stage 6 lulus untuk 304 unit dan 230 unit positif.
- Perhitungan ulang sensitivitas T50 dan T70 menggunakan aset Stage 3, grid historis Stage 6, pemfilteran lima piksel dan reducer berbobot telah lulus untuk **304 unit** berdasarkan batas toleransi absolut 0,000001 ha per unit.
- Nilai hasil baru sekitar T50 610,9156963 ha dengan 261 unit positif, T60 323,3340609 ha dengan 230 unit positif, dan T70 89,0284438 ha dengan 128 unit positif. Angka-angka tersebut konsisten dengan arsip Stage 7 berdasarkan toleransi yang sama.
- Sumber: `docs/STAGE7_304_VILLAGES_FRESH_GEE_WEIGHTED_PASS_2026-11-04.md` dan `docs/STAGE8_T50_T70_304_VILLAGES_FRESH_GEE_PASS_2026-11-04.md`.

Hasil ini **belum** berarti seluruh proses klasifikasi Dynamic World tahap awal, validasi historis Stage 5, parameter produksi, hasil moneter, dan uji spasial telah direproduksi secara independen.

Tahap analisis berikutnya adalah menguji ulang rumus dan koefisien intensitas tanam per desa untuk kapasitas produksi padi yang tidak lagi dihasilkan dan ekuivalen nilai output kotor. Perhitungan sensitivitas T50 memerlukan perhatian khusus karena jumlah unit positif lebih banyak dibandingkan spesifikasi T60. Koefisien yang tidak tersedia tidak boleh diimputasi semata-mata agar hasil sesuai angka manuskrip.
