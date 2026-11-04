# Tahap 11. Verifikasi Permutasi Kondisional LISA Kabupaten Mojokerto

**Tanggal audit: 4 November 2026**  
**Status: penghitungan ulang permutasi kondisional selesai, dengan temuan sensitivitas yang memerlukan penegasan pada manuskrip.**

## 1. Tujuan dan keterlacakan data

Tahap 11 mengulang pengujian acak kondisional Local Moran’s I menggunakan geometri administrasi Kabupaten Mojokerto, 304 unit administrasi, dan 230 unit dengan konversi T60 positif. Tahap 10 telah membuktikan kecocokan 838 nilai statistik Local Moran’s I terhadap arsip. Tahap 11 menguji aspek yang belum selesai, yaitu **nilai p dari pengacakan lokal**, bukan sekadar mengoreksi ulang nilai p historis.

Sumber data meliputi geometri asli dari arsip `Mojokerto_Admin_RTRW_304_for_GEE.zip`, nilai indikator dari `Stage7_FINAL_304_Desa.csv` yang sebelumnya direkonsiliasi dengan Tahap 9, serta nilai p historis dari `Mojokerto_QGIS_LISA_Codes_Combined.csv`. Berkas geometri tidak disertakan dalam arsip hasil baru karena hak redistribusinya belum dipastikan.

## 2. Metode

Setiap permutasi mempertahankan nilai indikator pada unit yang sedang diuji. Algoritma menarik sejumlah tetangga sebanyak derajat ketetanggaan asli dari kumpulan unit lainnya secara acak tanpa pengembalian. Nilai Local Moran dihitung menggunakan bobot seragam terstandardisasi baris dan varians sampel berpenyebut `n - 1`.

Nilai p semu dihitung sebagai `(jumlah nilai simulasi yang setidaknya sama ekstrem + 1) / (jumlah permutasi + 1)`. Statistik lokal positif menggunakan ekor atas dan statistik negatif menggunakan ekor bawah sesuai konvensi pengujian GeoDa. Sumber utama metode tersedia pada [GeoDa Glossary](https://geodacenter.github.io/glossary/) dan [dokumentasi PySAL Moran Local](https://pysal.org/esda/v2.9.0/source/generated/esda.Moran_Local.html).

Tiga keluarga pengujian diperlakukan terpisah pada koreksi Benjamini–Hochberg, masing-masing menggunakan q = 0,05. Pemeriksaan tambahan menggunakan koreksi Benjamini–Yekutieli yang lebih konservatif terhadap dependensi antar pengujian.

Spesifikasi utama memakai tetangga `intersects` bagi 304 unit luas konversi dan kapasitas tahunan, serta KNN 8 bagi 230 unit kapasitas per hektare. Sensitivitas mencakup dua benih acak pada 999 dan 9.999 permutasi, dua benih pada 99.999 permutasi untuk dua indikator 304 unit, alternatif `touches` dengan perbaikan satu poligon tanpa tetangga, serta KNN 6 dan KNN 12 untuk indikator per hektare.

Nilai p hasil penghitungan baru **tidak diharapkan identik dengan nilai p historis** karena keadaan awal pengacakan serta implementasi generator bilangan acak GeoDa tidak tersedia. Kecocokan struktur statistik pengamatan, kestabilan simpulan, dan variasi hasil antar benih lebih relevan daripada memaksakan kesamaan probabilitas setiap unit.

## 3. Hasil utama pengujian FDR

| Indikator | FDR historis dari 999 permutasi | 999 permutasi baru, benih A dan B | 9.999 permutasi baru, benih A dan B | 99.999 permutasi baru, benih A dan B |
|---|---:|---:|---:|---:|
| Luas konversi, 304 unit | 0 | 0 dan 0 | 8 dan 0 | **8 dan 7** |
| Kapasitas produksi beras tahunan, 304 unit | 0 | 0 dan 0 | 4 dan 5 | **6 dan 6** |
| Kapasitas produksi beras per hektare, 230 unit | 70 | 72 dan 72 | **74 dan 73** | Tidak diuji |

Hasil baru mengonfirmasi bahwa pengujian lokal 999 permutasi memberikan resolusi nilai p minimum sebesar 0,001. Resolusi tersebut dapat memengaruhi Benjamini–Hochberg ketika keluarga pengujian berisi 304 unit. Nilai p yang lebih kecil dapat terdeteksi melalui 9.999 atau 99.999 permutasi. Oleh karena itu, kesimpulan bahwa seluruh lokasi tidak signifikan setelah FDR pada spesifikasi historis 999 permutasi **tidak cukup untuk menyatakan tidak adanya sinyal lokal**.

Namun, hasil luas konversi juga menunjukkan ketidakstabilan Monte Carlo pada 9.999 permutasi. Dua benih menghasilkan 8 dan 0 unit FDR. Kestabilan membaik pada 99.999 permutasi menjadi 8 dan 7 unit, dengan tujuh unit yang sama pada kedua benih. Nilai q beberapa unit tetap berada dekat ambang 0,05 sehingga interpretasinya perlu berhati-hati.

Kapasitas produksi tahunan menghasilkan enam unit FDR yang **identik pada dua pengujian 99.999 permutasi**. Ketiganya merupakan High-High dan tiga lainnya Low-Low.

| Klasifikasi | Unit yang stabil pada kedua benih, 99.999 permutasi |
|---|---|
| High-High | Desa Purwojati, Kecamatan Ngoro. Desa Sukoanyar, Kecamatan Ngoro. Desa Kembangringgit, Kecamatan Pungging |
| Low-Low | Desa Begaganlimo, Kecamatan Gondang. Desa Rejosari, Kecamatan Jatirejo. Desa Pakis, Kecamatan Trowulan |

Hasil tersebut hanya berlaku bagi parameter ketetanggaan dan prosedur permutasi yang dijalankan. Nilai q berkisar mendekati 0,05 pada beberapa unit.

## 4. Kepekaan terhadap pilihan bobot spasial

Sebanyak **41 dari 304 unit** mempunyai daftar tetangga berbeda antara aturan `intersects` dan `touches` dengan penanganan poligon terisolasi. Perbedaan tersebut berpengaruh pada statistik lokal dan dapat mencakup perpotongan akibat geometri yang bertumpang tindih, bukan semata-mata Queen contiguity konvensional.

| Konfigurasi | Jumlah signifikan setelah BH FDR pada 9.999 permutasi |
|---|---:|
| Luas konversi, `intersects`, benih A | 8 |
| Luas konversi, `intersects`, benih B | 0 |
| Luas konversi, `touches` | 0 |
| Kapasitas tahunan, `intersects`, benih A | 4 |
| Kapasitas tahunan, `intersects`, benih B | 5 |
| Kapasitas tahunan, `touches` | 4 |
| Kapasitas per hektare, KNN 6 | 51 |
| Kapasitas per hektare, KNN 8, benih A dan B | 74 dan 73 |
| Kapasitas per hektare, KNN 12 | 103 |

Jumlah signifikan indikator per hektare berubah cukup besar antar konfigurasi KNN. Kesimpulan tentang adanya asosiasi global positif tetap didukung Tahap 10, tetapi batas serta keanggotaan klaster lokal tidak boleh dianggap tidak bergantung pada pilihan bobot spasial.

## 5. Benjamini–Yekutieli sebagai uji konservatif

Prosedur Benjamini–Yekutieli mempertimbangkan kemungkinan dependensi yang tidak memenuhi persyaratan Benjamini–Hochberg. Prosedur ini diperlakukan sebagai **uji ketahanan tambahan**, bukan perubahan diam-diam terhadap metode manuskrip.

Pada kedua pengujian 99.999 permutasi, jumlah unit signifikan untuk luas konversi dan kapasitas tahunan menjadi **nol** setelah koreksi Benjamini–Yekutieli. Sebanyak **48 dan 46 unit** indikator per hektare masih signifikan pada dua benih 9.999 permutasi.

Kesimpulan kebijakan yang menuntut kepastian lokasi perlu menyebut ketergantungan pada metode koreksi, jumlah permutasi, dan konstruksi bobot.

## 6. Evaluasi 12 kandidat inti eksploratif

Sebanyak 12 kandidat inti berasal dari penapisan Tipe A dan High-High nominal pada kapasitas tahunan serta kapasitas per hektare. Pengulangan permutasi dengan 999 permutasi menghasilkan masing-masing 10 kandidat yang kembali memenuhi syarat nominal pada kedua benih. Pengujian 9.999 permutasi menghasilkan 11 dan 10 kandidat nominal.

**Dua kandidat inti memenuhi FDR untuk kedua indikator pada kedua pengujian 9.999 permutasi**:

- Desa Purwojati, Kecamatan Ngoro.
- Desa Kembangringgit, Kecamatan Pungging.

Kedua desa tersebut juga termasuk High-High kapasitas tahunan yang bertahan pada dua pengujian 99.999 permutasi. Hasil kapasitas per hektare diuji pada 9.999 permutasi dan bukan 99.999 permutasi. Status kedua desa pada uji baru tidak dapat diterapkan secara langsung pada nilai p historis 999 permutasi tanpa perubahan penjelasan metode dan pembahasan sensitivitas.

## 7. Verifikasi teknis dan batas penelitian

Pemeriksaan otomatis menyatakan **PASS** untuk 24 kombinasi simulasi yang memuat 6.704 keluaran unit dan indikator. Setiap baris mempertahankan sumber p historis, nilai p baru, hasil FDR, kuadran lokal, jumlah tetangga, jumlah permutasi, serta benih acak. Nilai Local Moran pengamatan pada 838 unit dan indikator sesuai dengan hasil yang telah diverifikasi pada Tahap 10 tanpa selisih numerik yang terdeteksi.

Nilai p historis tidak dapat direkonstruksi secara bitwise karena status generator acak asli tidak tersedia. Pengujian ini juga tidak membuktikan seluruh geometri administrasi bebas dari irisan dan celah topologis. Penggunaan BH untuk nilai p yang saling berkorelasi memerlukan kehati-hatian. Hasil baru tidak mengubah angka luas konversi atau kehilangan kapasitas produksi yang telah diverifikasi pada Tahap 7 sampai Tahap 9.

## 8. Arahan perbaikan manuskrip

Manuskrip sebaiknya **mempertahankan hasil historis sebagai hasil utama** dengan penjelasan bahwa 999 permutasi menghasilkan nol klaster setelah BH untuk luas konversi dan kapasitas produksi tahunan. Pembahasan sensitivitas perlu menambahkan bahwa pengulangan independen 99.999 permutasi dapat mengidentifikasi 7 sampai 8 unit luas konversi dan enam unit kapasitas produksi tahunan setelah BH pada `intersects`, sedangkan hasil menjadi lebih konservatif setelah penerapan `touches` atau Benjamini–Yekutieli.

Manuskrip perlu membedakan 12 kandidat nominal historis dari dua kandidat yang bertahan sebagai High-High pada dua pengujian 9.999 permutasi baru. Istilah hotspot yang telah dikonfirmasi secara kebijakan tetap tidak tepat tanpa penelaahan batas lahan pertanian dilindungi, tata ruang, dan izin secara independen.

**Kesimpulan Tahap 11:** Pengulangan independen nilai p LISA lokal selesai. Reproduksibilitas statistik lokal telah meningkat dari pencocokan arsip menjadi pengujian Monte Carlo baru, tetapi stabilitas signifikansi sangat dipengaruhi ketelitian Monte Carlo, konstruksi ketetanggaan dan pilihan koreksi multipengujian. Temuan ini mendukung revisi penjelasan ketidakpastian dalam manuskrip, bukan perubahan otomatis seluruh peta dan klaim penelitian.

## Berkas keluaran

- `Stage11_Local_Conditional_Permutation_All_Scenarios.csv`, seluruh 6.704 pengujian unit dan skenario.
- `Stage11_Sensitivity_Scenario_Summary.csv`, 24 ringkasan pengujian.
- `Stage11_BH_vs_BY_Multiple_Testing_Robustness.csv`, pembandingan dua koreksi multipengujian.
- `Stage11_99k_FDR_304_Unit_Reproducibility.csv`, semua anggota klaster FDR pada 99.999 permutasi beserta konsistensi antar benih.
- `Stage11_838_Unit_Original_vs_Independent_PValues.csv`, komparasi nilai p historis dan nilai p independen.
- `Stage11_Original_12_Candidate_Robustness.csv`, evaluasi 12 kandidat asli.
- `Stage11_Queen_Geometry_Weights_Differences.csv`, selisih struktur tetangga untuk 304 unit.
- `Stage11_Independent_Conditional_LISA_Permutations.py`, skrip lengkap yang dapat dijalankan ulang.
- `Stage11_Validate_Results.py`, pemeriksaan numerik dan integritas.
- `Stage11_Postprocess_Robustness.py`, rekap ketahanan hasil.