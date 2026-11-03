# Audit arsip Stage 6 Kabupaten Mojokerto

**Status:** verifikasi arsip lokal berhasil. Eksekusi ulang server Google Earth Engine belum dilakukan.

| Parameter | Arsip yang dihitung ulang | Acuan | Status |
|---|---:|---:|---|
| Luas konversi (ha) | 323.3340607229 | 323.3340607 | Cocok |
| Unit administrasi | 304 | 304 | Cocok |
| Unit terkonversi | 230 | 230 | Cocok |
| Beras yang tidak lagi tersedia (ton per tahun) | 1628.67827753 | 1628.68 | Cocok |
| Geometri identik pada kedua arsip | 230 | 230 | Cocok |
| Sampel Stage 5 dalam batas wilayah | 60 | 60 | Cocok |
| Sampel konversi benar Stage 5 | 35 dari 40 | 35 dari 40 | Cocok |

## Batas pelaksanaan

Skrip GEE Stage 1 sampai Stage 6 **tidak dieksekusi ulang** dalam audit ini karena autentikasi Earth Engine tidak tersedia. Kecocokan total keluaran arsip tidak boleh dilaporkan sebagai reproduksi citra piksel demi piksel.

Data geometri pada kedua ZIP mempunyai CRS EPSG:32749.

## Berkas referensi dan SHA-256

- `Mojokerto_GeoDa_304_Conversion_and_RiceTotal.zip`: `bc8d6dca6f616af10ef498b8e607c898bc5d236e46f7fb967f228d586fd657e5`
- `Mojokerto_GeoDa_230_RiceIntensity.zip`: `d8ecec757cbe026db4ee547f0669411ccac6bbf213025b9dc5f3ee6fcbe5ad50`
- `Mojokerto_Stage5_QA60_Points_revised.csv`: `8becedeaf851e24c2d8443ac839a6f86335be5c2f95248d0114da4084c2232fb`