# Tahap 12: Audit dan revisi interpretasi spasial manuskrip 805005

**Status: revisi teks manuskrip selesai.** Berkas DOCX sumber `805005_Fikriyah_Revisi_Stage7_Sensitivitas_Spasial_Final_Biru.docx` digunakan sebagai dasar penyuntingan. Hasil revisi `805005_Fikriyah_Stage12_Spatial_Inference_Revised_Biru.docx` dan matriks berisi teks lama serta teks baru telah diberikan sebagai artefak percakapan. Sumber DOCX asli tetap tidak diubah.

## Temuan empiris yang digunakan

| Indikator | FDR historis, 999 permutasi | Dua benih baru pada 9.999 permutasi | Dua benih baru pada 99.999 permutasi |
| --- | ---: | ---: | ---: |
| Luas konversi, 304 unit | 0 | 8 dan 0 | 8 dan 7 |
| Kapasitas beras tahunan, 304 unit | 0 | 4 dan 5 | 6 dan 6 |
| Kapasitas beras per hektare, 230 unit | 70 | 74 dan 73 | Tidak dihitung |

Pengujian sensitivitas menggunakan dua benih dan permutasi kondisional independen. Bobot `intersects` untuk hasil lokal historis memiliki daftar tetangga berbeda terhadap `touches` bagi 41 dari 304 unit. Pada pengujian ketahanan 9.999 permutasi, KNN 6 menghasilkan 51 unit signifikan dan KNN 12 menghasilkan 103 unit signifikan untuk indikator per hektare. Koreksi Benjamini–Yekutieli mengurangi jumlah unit signifikan menjadi nol untuk luas dan kapasitas tahunan pada 99.999 permutasi.

Dua kandidat nominal historis, Desa Purwojati di Kecamatan Ngoro dan Desa Kembangringgit di Kecamatan Pungging, memiliki High-High yang bertahan pada kedua pengujian 9.999 permutasi setelah koreksi BH untuk indikator kapasitas tahunan dan kapasitas per hektare. Hasil ini belum cukup untuk menyatakan prioritas LP2B atau ketidaksesuaian pemanfaatan ruang.

## Revisi dalam manuskrip

Manuskrip yang dihasilkan memiliki **delapan paragraf diganti dan empat paragraf ditambahkan**. Penyuntingan mencakup abstrak, definisi bobot spasial, pemisahan 999 permutasi GeoDa lokal historis dari 1.999 permutasi sensitivitas global, perincian prosedur permutasi kondisional independen, hasil sensitivitas FDR, ketahanan bobot spasial, dua kandidat inti yang lebih konsisten, pembahasan, dan kesimpulan.

Hasil GeoDa historis tetap berperan sebagai analisis utama. Hasil permutasi baru berperan sebagai pengujian ketahanan terpisah. Manuskrip tidak lagi menyatakan nol klaster signifikan sebagai kesimpulan yang berlaku umum bagi seluruh spesifikasi.

**Tidak diubah:** luas T50, T60, dan T70, kapasitas produksi beras, estimasi nilai output kotor, delapan tabel asli, serta seluruh gambar yang tertanam. Figure 4 tetap memperlihatkan klasifikasi LISA nominal historis dan tidak diperlakukan sebagai peta klaster hasil FDR baru.

## Pengendalian mutu

- Struktur sumber: 190 paragraf, delapan tabel, empat objek gambar inline.
- Struktur revisi: 194 paragraf, delapan tabel, empat objek gambar inline.
- Isi tabel dipertahankan secara identik.
- Seluruh gambar tertanam memiliki isi biner yang sama.
- DOCX hasil revisi berhasil dirender menjadi 21 halaman dan telah diperiksa secara visual.
- Teks yang ditambahkan atau diganti diberi warna biru untuk memudahkan pemeriksaan.

## Batas verifikasi

Pengujian Tahap 11 tidak memulihkan keadaan acak GeoDa historis sehingga nilai p baru tidak wajib sama persis dengan nilai p lama. Ketahanan terhadap bobot spasial dan metode koreksi tidak membenarkan penetapan hotspot kebijakan tanpa pemeriksaan data LP2B, RTRW, izin, dan batas persil.

## Sumber

- [Audit Tahap 10](STAGE10_SPATIAL_MORAN_LISA_FDR_VERIFICATION_2026-11-04.md)
- [Audit Tahap 11](STAGE11_LOCAL_CONDITIONAL_PERMUTATION_SENSITIVITY_2026-11-04.md)
- [Ringkasan 24 skenario Tahap 11](../qa_outputs/Stage11_Conditional_Local_Permutation_Scenario_Summary_2026-11-04.csv)
- [Daftar anggota FDR pada 99.999 permutasi](../qa_outputs/Stage11_99k_FDR_304_Unit_Reproducibility_2026-11-04.csv)
