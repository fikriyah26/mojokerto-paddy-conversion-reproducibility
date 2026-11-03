# Administrative boundary verification for Kabupaten Mojokerto

**Audit date:** 3 November 2026

## Evidence locations and scope

The working boundary archive `Mojokerto_Admin_RTRW_304_for_GEE.zip` was retrieved from the research Library, together with `Mojokerto_GEE_GitHub_Siap_Unggah_Dengan_Shapefile_RTRW.zip`. The larger archive contains the original source `data_admin/source_308_polygons/admin_kab_mojokerto.shp`, its sidecar files, and the derived 304-unit boundary.

The connected Google Drive search did not expose a file named `admin_kab_mojokerto` or the derived GEE archive during this audit. Thus, this audit verifies the available archived copies rather than asserting live Google Drive file identity.

## Geometric and attribute findings

| Check | Result |
| --- | --- |
| Source layer | 308 polygons |
| Derived layer | 304 features |
| Unique source district-village keys | 304 |
| Derived unique district-village keys | 304 |
| Districts | 18 |
| Coordinate reference system | EPSG:32749 |
| Source metadata attribute | PPBW BIG Tahun 2021 |
| Province attribute | Provinsi Jawa Timur |
| Regency attribute | Kabupaten Mojokerto |
| Required fields | KECAMATAN, DESAKEL |
| Missing district-village names | 0 |
| Missing geometries | 0 |
| Invalid geometries | 0 |
| Geographic extent | [646997.7593, 9139833.9994, 683563.3848, 9192484.4575] in EPSG:32749 |
| Dataset polygon area | 984.2492023190476 km2 |
| Source vs derived union symmetric difference | 0 m2 for every unit |

The source includes four multipart district-village keys, each with two polygon pieces:

- Kecamatan Gedeg, Desa Ngareskidul
- Kecamatan Gondang, Desa Kemasantani
- Kecamatan Jetis, Desa Mojorejo
- Kecamatan Mojosari, Desa Seduri

Each pair was dissolved into its matching derived feature without changing its polygonal union.

## Comparison with Stage 7

The archived `Stage7_FINAL_304_Desa.csv` contains exactly 304 analytical units. The administrative shapefile stores `KECAMATAN` values with the prefix `Kecamatan`, whereas that archived final CSV omits the prefix. When this naming difference is normalized, all 304 pairs of district and village names match exactly. The name mismatch is formatting only, not evidence of missing geographical units.

The derived Stage 7 T60 sum remains 323.3340607228837 ha. This comparison checks administrative identifiers and numerical consistency, not raster pixel identity or Google Earth Engine execution.

## Original GEE input archive

`Mojokerto_Admin_RTRW_304_for_GEE.zip` contains one shapefile with five components: `.shp`, `.shx`, `.dbf`, `.prj`, and `.cpg`. Its SHA-256 digest is:

`e32a916607602cd11c8a45d100d44a317e46c7a2cc770856df8ce32c71eab91c`

The archive has been verified locally as structurally complete. The existence of an uploaded Google Earth Engine table asset and the historical asset ID remain unverified.

## Next GEE verification

1. Upload the verified 304-unit shapefile archive as a private table asset through the study Earth Engine project, unless the original imported table asset already exists.
2. Preserve the original boundary input and record the exact uploaded asset identifier and ingest task metadata.
3. Inspect `table.size()`, the fields `KECAMATAN` and `DESAKEL`, unique keys, district count, source attribute, and area after asset ingestion.
4. Compare imported geometry against the historical boundary reference, noting that Earth Engine transforms vector data to its internal geodetic representation.
5. Only after administrative and Stage 3 assets are verified should the read-only raster diagnostic and historical pixel-level comparison be enabled.

Do not publicly redistribute original boundary geometry until its data reuse terms are established. This private repository records verification metadata without publishing the shapefile itself.

## Status

**Offline boundary verification: PASS.**

**Live GEE asset ingestion and raster reconstruction: NOT TESTED.**
