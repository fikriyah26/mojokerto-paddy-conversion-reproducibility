# Locked historical Stage 6 raster audit, 4 November 2026

## Sources

Original binary GeoTIFF from connected Google Drive:
https://drive.google.com/file/d/1zzkj1MFlr_T9zYB1f7SCneXJNyKg_W74/view

Verified 304-unit administrative shapefile: `Mojokerto_Admin_RTRW_304_for_GEE.zip`, retained in the author's research archive.

The original GeoTIFF itself is **not** redistributed here, pending source-data redistribution review. TIFF SHA-256: `6660381c18df7fc03f9b83469892e589ab2afee1907b1d6654b9cd88fdaf6e1e`.

## Raster grid read from the actual TIFF

- Width = 3696 pixels, height = 5347 pixels, 1 band.
- Pixel values = binary 0 or 1, with 33,126 positive pixels.
- CRS = EPSG:3857, affine = `[10, 0, 12504720, 0, -10, -815190]`.
- Pixel extent in EPSG:3857 = `[12504720, -868660, 12541680, -815190]`.
- Source raster Stage 3 has a **different** native CRS, EPSG:4326, nominal 10 m.

## Independent pixel-centre audit

Python rasterio, geopandas, shapely and pyproj were used to assign positive raster-pixel centres to the archived 304 polygons and compute geodesic pixel areas in hectares.

| Measure | Value |
| --- | ---: |
| Positive pixels in full GeoTIFF | 33126 |
| Positive pixel centres inside 304-unit boundary | 33113 |
| Positive pixel centres outside boundary | 13 |
| Geodesic area of all positive TIFF pixels | 323.4613923010337 ha |
| Geodesic area with centres within boundaries | 323.3343550679597 ha |
| Historical locked Stage 6 reference | 323.33406072288363 ha |
| Difference: centre-based check minus historical | 0.00029434507604 ha |
| Administrative units with positive pixel centres | 228 |
| Historical administrative units with positive conversion area | 230 |

The difference is approximately 2.94 square metres at the study-area level. Centre-in-polygon allocation is **not** equivalent to Earth Engine's area-weighted zonal reduction, particularly for tiny boundary fragments. The difference between 228 and 230 positive units must not be called a classification failure on this evidence.

Example for diagnostic testing: Kecamatan Kutorejo contains 2,830 positive pixel centres with a geodesic area of 27.630283184373937 ha. A new read-only comparison can use these two values to check its reference-grid and centre-assignment implementation.

An 18-kecamatan derivative CSV is at `qa_outputs/locked_stage6_tif_district_pixel_center_qc_2026-11-04.csv`. The full 304-unit derivative CSV is available in the working audit artifact. The underlying polygons and raster are not included in the private GitHub archive.

## Comparison with the GEE reconstructed Stage 6

The author's completed GEE batch export from the historical Stage 3 image reported:

- T60 candidate before filtering: 332.3841543521086 ha.
- T60 after reconstructed eight-connected >=5-pixel patch filter: 323.5819606929078 ha.
- Locked Stage 6 reference: 323.33406072288363 ha.
- Reconstructed-minus-locked difference: +0.2478999700241502 ha.

This GEE result matches the earlier reviewer-folder T60 total at floating point precision but **does not reproduce** the locked Stage 6 area. The offline TIFF audit independently supports the locked historical estimate. Projection, affine origin, connected-component evaluation, masks, and zonal reduction should be compared without silently changing the study's original figures. No particular mechanism has yet been established as the cause.

## Next controlled GEE checks

1. Run `gee/04_inventory_historical_locked_assets_READ_ONLY.js` in the original legacy namespace `users/fikriiyah26` to locate any preserved historical Stage 6 Image asset.
2. If no such asset exists, ingest the archived locked GeoTIFF as a **new, private reference asset**, never overwrite a research asset. Verify its CRS and affine immediately after ingestion.
3. Fill the verified asset ID into `gee/05_stage6_locked_grid_district_BATCH.js`. Its first run is restricted to Kecamatan Kutorejo and exports a single comparison CSV.
4. Evaluate original locked pixel counts, rebuilt pixel counts, and disagreements on the **exact EPSG:3857 affine grid**. This version deliberately regrids Stage 3 before patch filtering to test grid sensitivity. It must **not** be described as a proven replay of the historical Stage 4 algorithm.
5. Only after the one-district check passes or its differences have been explained, expand to the other 17 districts and compare 304-unit results.

## Status

**Historical GeoTIFF integrity and independent area plausibility: PASS.**

**Raster identity of reconstructed vs historical Stage 6: NOT VERIFIED.**

Private GitHub archival status is not equivalent to public reproducibility or a published DOI.

## Spatial aggregation caution

An additional comparison of the offline pixel-centre totals with the locked Stage 7 area totals by district found maximum absolute district difference approximately 0.0136844 ha in Kecamatan Dawarblandong. The second-largest was approximately 0.0112978 ha in Kecamatan Puri. Differences can compensate across districts, leaving the kabupaten-wide difference only 0.0002943 ha. This demonstrates why a close regional aggregate is supportive but does not establish individual-pixel or individual-district identity.


## Discovery of the original locked GEE IMAGE (author Console, 4 November 2026)

**The original locked Stage 6 raster was located in the author's historical GEE legacy namespace.** It is not necessary to ingest a duplicate TIFF for the next comparison.

- Full returned asset name: `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`
- Legacy alias: `users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`
- Asset type: `IMAGE`
- Band: `final_conv`
- Author-reported affine: `[10, 0, 12504720, 0, -10, -815190]`

The affine exactly matches the preserved GeoTIFF. The Code Editor displayed the projection as a collapsed `Projection` object, so the EPSG identifier must be printed explicitly and confirmed before claiming the original GEE image and TIFF are on the same CRS. Matching transforms and names do not by themselves establish pixel-for-pixel identity.

The historical Stage 3 source remains `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`, with seven bands and an EPSG:4326 native grid. Other legacy results matching the inventory search concern unrelated study regions and must not be used as Mojokerto Stage 6.

**Next step:** run the corrected `gee/05_stage6_locked_grid_district_BATCH.js`, now preconfigured with the verified original locked image. It initially processes only Kecamatan Kutorejo and exports one read-only comparison CSV to Drive. It intentionally tests Stage 3 resampling onto the locked grid before five-pixel filtering and is not yet a verbatim replay of historical processing.
