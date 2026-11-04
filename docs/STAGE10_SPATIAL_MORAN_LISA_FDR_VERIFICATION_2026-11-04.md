# Tahap 10: Reproduksi Moran's I Global, LISA Lokal, dan FDR

**Tanggal pemeriksaan: 4 November 2026**

**Status: PASS untuk nilai statistik global, statistik lokal, dan koreksi FDR atas nilai p historis. Pengujian permutasi kondisional lokal belum diulang.**

## Sumber dan keterkaitan

Input geometri berasal dari `Mojokerto_Admin_RTRW_304_for_GEE.zip` yang telah dikonfirmasi setara dengan union geometri administratif GeoDa 304 unit. Statistik luas konversi dan kapasitas beras per tahun berasal dari `Stage7_FINAL_304_Desa.csv` dalam arsip penelitian yang sebelumnya direkonsiliasi terhadap Tahap 7 sampai Tahap 9. Nilai LISA dan p awal berasal dari `Mojokerto_QGIS_LISA_Codes_Combined.csv`.

Berkas geometri sumber tidak diunggah ke repositori karena hak redistribusi belum dipastikan. Kode Python, data turunan dan laporan lengkap disimpan dalam arsip hasil Tahap 10 yang disediakan di percakapan. Ringkasan kuantitatif tetap dicatat di repositori ini.

## Moran's I global

Moran global menggunakan bobot terstandardisasi baris, Queen berbasis predikat `touches` dengan penanganan nearest-neighbor bagi poligon yang tidak memiliki tetangga, serta KNN 4, 6, 8 dan 12 dari centroid poligon. Pengujian global menggunakan 1.999 permutasi acak, seed 20261025, dan probabilitas pseudo satu sisi atas.

**25 dari 25 kombinasi indikator dan bobot menghasilkan I, nilai p, dan skor z yang cocok dengan arsip.** Selisih terbesar I sebesar 6.6058269965196814e-15, seluruh selisih nilai p sama dengan 0, dan selisih terbesar z permutasi kurang dari 2.5e-13.

| Indikator | Unit | Bobot | I | p atas | z |
| --- | ---: | --- | ---: | ---: | ---: |
| Luas konversi | 304 | Queen + nearest-neighbor untuk pulau | 0.1605510371696768 | 0.001 | 4.815990620620046 |
| Kapasitas beras tahunan | 304 | Queen + nearest-neighbor untuk pulau | 0.23568845490068563 | 0.0005 | 6.955004848071197 |
| Kapasitas beras per hektare | 230 | KNN 8 | 0.5357241471212675 | 0.0005 | 17.03850942003453 |

Predikat `touches` menemukan satu pulau pada 304 unit, yaitu Desa Pekukuhan di Kecamatan Mojosari. Subset 230 unit memiliki dua pulau, yaitu Desa Begaganlimo di Kecamatan Gondang dan Desa Pekukuhan di Kecamatan Mojosari. Keduanya mendapat satu tetangga terdekat untuk pengujian Queen global.

## Moran's I lokal dan definisi Queen

**838 dari 838 nilai Local Moran's I** direproduksi hingga toleransi 1e-9, dengan selisih absolut terbesar sekitar 4.7e-13. Hasil lokal untuk 304 unit identik dengan arsip apabila bobot tetangga dibentuk dari predikat geometri `intersects`. Penggunaan `touches` sebagai pengganti memberikan 41 ketidaksesuaian nilai lokal untuk luas konversi dan 41 untuk kapasitas tahunan.

Penghitungan lokal 230 unit menggunakan KNN 8. Rumus lokal mengikuti varians sampel `sum(z²)/(n-1)`. Perbedaan `intersects` dan `touches` merupakan temuan teknis yang perlu dipertahankan dalam audit ketetanggaan. Predikat `intersects` dapat mencakup tumpang tindih geometri, bukan hanya sentuhan tepi atau titik.

## Koreksi Benjamini-Hochberg

Nilai p lokal asli berasal dari hasil GeoDa atau QGIS yang terdokumentasi dengan **999 permutasi kondisional**. Nilai tersebut digunakan kembali untuk pengujian ulang prosedur Benjamini–Hochberg pada q = 0.05, terpisah bagi tiga keluarga pengujian. **838 dari 838 nilai q dan keputusan FDR cocok dengan arsip**.

| Indikator | N | p lokal kurang dari 0.05 | FDR q tidak lebih dari 0.05 | High-High FDR |
| --- | ---: | ---: | ---: | ---: |
| Luas konversi | 304 | 55 | 0 | 0 |
| Kapasitas beras tahunan | 304 | 70 | 0 | 0 |
| Kapasitas beras per hektare | 230 | 110 | 70 | 27 |

**Koreksi FDR ini bukan reproduksi independen nilai p lokal**, karena permutasi kondisional lokal 999 kali belum diulang pada Tahap 10. Jangan menggabungkan desain permutasi lokal 999 kali dengan pengujian sensitivitas global 1.999 kali sebagai satu prosedur.

## Kandidat inti eksploratif

Median luas konversi T60 pada 230 unit sebesar 0.9150309504879219 ha dan median kapasitas produksi beras per hektare sebesar 5.348577563070499 t/ha/tahun. Sebanyak 54 unit Tipe A mempunyai kedua nilai tidak kurang dari median.

Irisan Tipe A, High-High nominal kapasitas tahunan, dan High-High nominal kapasitas per hektare menghasilkan 12 kandidat inti. Enam kandidat tersebut juga High-High nominal untuk luas konversi, yaitu Desa Wonodadi di Kecamatan Kutorejo, Desa Purwojati dan Desa Tanjangrono di Kecamatan Ngoro, serta Desa Kembangringgit, Desa Pungging dan Desa Randuharjo di Kecamatan Pungging.

Ke-12 kandidat tetap merupakan hasil penapisan eksploratif. Tidak ada lokasi inti yang terkonfirmasi berdasarkan FDR indikator kapasitas produksi tahunan, sehingga penetapan hotspot definitif atau prioritas LP2B tidak dibenarkan hanya berdasarkan pengujian ini.

## Kesimpulan dan pekerjaan tersisa

- Moran global: **25/25 PASS**, termasuk seluruh nilai p global dan z hasil permutasi 1.999 kali.
- Moran lokal: **838/838 PASS** untuk nilai statistik dengan aturan bobot sesuai keluaran historis.
- FDR historis: **838/838 PASS** setelah koreksi ulang terhadap p lokal yang telah tersedia.
- Kriteria Tipe A dan 12 kandidat eksploratif, termasuk enam kandidat tambahan, dapat direproduksi.
- Permutasi kondisional LISA lokal sebanyak 999 kali: **BELUM DIREPRODUKSI**.

Tahap berikutnya adalah pengujian ulang permutasi kondisional LISA, penjelasan eksplisit aturan geometri `intersects` dibandingkan `touches`, dan verifikasi apakah perubahan lingkungan perangkat lunak mengubah probabilitas lokal. Hak pembagian shapefile dan sumber p-value tetap perlu diperiksa sebelum rilis data publik.
