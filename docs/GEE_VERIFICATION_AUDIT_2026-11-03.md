# GEE Stage 1–6 verification audit

Audit date: 3 November 2026.

## Result

**PARTIALLY VERIFIED.** The reconstructed source passes local JavaScript syntax and configuration checks. Archived Stage 6 and Stage 7 numerical records reconcile. An authenticated server-side Google Earth Engine rerun was **not** performed, and pixel-for-pixel equivalence with the historical locked raster has **not** been established.

| Check | Finding |
| --- | --- |
| Main reconstructed JS syntax | PASS, local node check |
| Additional threshold and omission-design JS syntax | PASS, local node check |
| Baseline and end years | 2017–2019 and 2023–2025, matching documented configuration |
| Thresholds | crops P75 >= 0.40, crops-label frequency >= 0.20, built T50/T60/T70 |
| Coverage requirement | At least five valid observations per pixel-year, with 2/3 persistence |
| Patch filter | At least five pixels, eight-connected, nominal 10 m |
| Area CRS | EPSG:32749 |
| Archived administrative rows | 304 distinct units after harmonization |
| Archived T60 conversion | 323.3340607228837 ha across 230 positive units |
| Archived Stage 6 vs Stage 7 maximum per-unit area difference | About 5.018208e-13 ha |
| Archived Stage 6 vs Stage 7 maximum per-unit rice difference | About 6.139089e-12 tonnes/year |
| Live GEE authentication, assets and execution | NOT TESTED |
| Historical Stage 3 raster availability | NOT VERIFIED |
| Raster-level equivalence with locked Stage 6 | NOT VERIFIED |
| Reconstructed Stage 5 sampling identity | NOT VERIFIED |

## Blockers and methodological cautions

1. The original GEE Cloud project and verified administrator asset ID have not been established. The reconstructed source expects imported `table` when `ADMIN_ASSET` is blank.
2. The author confirmed the historical Stage 3 asset ID as `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`. The legacy username contains two `i` letters after `fikr`. This source location is distinct from the newly ingested administrative table. Asset readability and raster contents must still be verified using GEE Console.
3. The Stage 3 exclusion of baseline built-up, and parts of annual observation and masking logic, were reconstructed rather than copied from the original script. Code resemblance or a matching aggregate cannot establish complete equivalence.
4. The original administrative source comprised 308 polygon-part records harmonized to 304 analytical units. Both keys and geometry should be checked.
5. Sampling pools for Stage 5 reconstructed QA may yield different points from the 60 historically interpreted candidates. The reconstructed sample is not a replacement for the archived references.
6. The reviewer-folder threshold CSV differs from the verified 18-district historical Stage 7 exports. Keep them distinct until provenance is established.
7. No omission error or area-adjusted confidence interval was established by this audit.

## Next action in Code Editor

Use [the read-only GEE preflight script](../gee/00_preflight_assets_DIAGNOSTIC.js).

- Open https://code.earthengine.google.com/ using the study's Earth Engine Cloud project.
- Import the original administrative FeatureCollection as `table` or fill its exact verified asset ID into `ADMIN_ASSET`.
- Start with `CHECK_STAGE3 = false`. Inspect unit count, administrative field names, and Dynamic World year coverage.
- Verify the original Stage 3 asset in Assets before filling `STAGE3_ASSET` and enabling `CHECK_STAGE3 = true`.
- If the independently preserved historical Stage 6 asset is available, fill `LOCKED_STAGE6_ASSET` and enable `CHECK_LOCKED_PIXELS = true`. Record total disagreement, grid and masks.
- Save the GEE Console output, task metadata and asset references as evidence.

The script has **no export commands**, and does not overwrite any existing images or tables.

## Acceptance criteria

Document historical area of 323.33406072288363 ha, 230 positive administrative units of 304, 10 m raster grid and matching masks. Rerunning on another AOI or another pixel origin and recovering a similar aggregate is insufficient. Pixel agreement requires verified original and reconstructed images on the same grid. Investigate numerical discrepancies rather than alter source parameters solely to obtain expected totals.

The manuscript reviewer comment on public reproducibility should remain **Sebagian**. Private GitHub staging and offline audit do not fulfill the request for an openly accessible archive or a complete live GEE reproduction.

## GEE Code Editor confirmation reported by the author, 3 November 2026

The author imported `projects/project-fikriyah/assets/Mojokerto_Admin_RTRW_304_for_GEE` into the Earth Engine project and reported the following live Console results: 304 administrative features, 18 distinct districts, 304 distinct district-village keys, and attributes `SUMBER`, `KECAMATAN`, `AREA_KM2`, `KABUPATEN`, `DESAKEL`, `PROVINSI`, `system:index`. The user supplied a screenshot of the successfully ingested table asset.

**Status update:** administrative table ingestion and key/count verification PASS on author-provided GEE evidence. This does not validate the Stage 3 raster asset or reproduce the original satellite classification. The next read-only step is `gee/01_inventory_stage3_assets_READ_ONLY.js`.

## Legacy asset provenance correction (author confirmation, 3 November 2026)

The original analysis used legacy Earth Engine assets under `users/fikriiyah26`, rather than the later Cloud Assets namespace. All reconstructed source references and the Stage 3 inventory script have been corrected to use `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`.

The independent administrative-boundary verification in the new project remains valid as a separate step. The Cloud Assets table imported recently is not evidence that the original Stage 3 imagery was stored in that project. The read-only asset inspection is `gee/01_inventory_stage3_assets_READ_ONLY.js`. No live Stage 3 image content or band names have been reported yet.

## Live historical Stage 3 confirmation supplied by author (3 November 2026)

The author ran `gee/01_inventory_stage3_assets_READ_ONLY.js` in GEE Code Editor and reported:

- Original historical asset ID: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`
- Accessible asset type: `Image`
- Seven bands in the Image
- All three expected bands are present: `conv_T50`, `conv_T60`, `conv_T70`
- Nominal scale of the first band: 10 metres
- Projection object printed, but its complete CRS and affine transform were not supplied
- The imported administrative table in this run contained 308 polygon features

The 308 feature count is consistent with the original multipart shapefile (308 polygon parts for 304 district-village units), but GEE distinct-key count was not printed in this Stage 3 inventory run. A previous Code Editor verification of the separately imported dissolved boundary showed 304 features, 18 districts and 304 unique district-village units. The two table imports should not be conflated.

**Status: historical Stage 3 asset readability and expected band presence PASS.** Raster content, patch filtering, final T60 area and distinct positive units have **not** yet been reproduced by this live check.

The next read-only step is `gee/02_verify_T60_patch5_from_historical_stage3_READ_ONLY.js`. It first computes T60 after the five-pixel eight-connected component rule. An optional second phase counts unique positive district-village keys after polygon reduction. The second phase starts disabled to avoid a costly 308-feature reduction before the area check.


## Live Stage 6 reconstruction attempt and timeout (author Console, 3 November 2026)

The author executed `gee/02_verify_T60_patch5_from_historical_stage3_READ_ONLY.js` using the accessible historical Stage 3 asset and an imported source boundary containing 308 polygon pieces:

| Check | Observed |
| --- | --- |
| Source polygons | 308 |
| Distinct district-village units | 304 |
| Districts | 18 |
| Pre-filter T60 candidate area | 332.3841543521087 ha |
| After five-pixel eight-connected filter | Computation timed out in interactive Console |
| Historical locked Stage 6 T60 reference | 323.33406072288363 ha |
| Stage 3 raster CRS | EPSG:4326 |
| Stage 3 raster native nominal scale | 10 m |
| Affine transform | [0.00008983152841195215, 0, 112.33181099635063, 0, -0.00008983152841195215, -7.303123596834886] |

The difference between the observed pre-filter area and the historical final filtered reference is about **9.05009362922507 ha**, but this is **not yet a measured removed-patch area** because the post-filter operation did not finish. The original native raster grid is EPSG:4326, whereas the reconstructed Stage 6 area reducer was explicitly requested in EPSG:32749 at 10 metres. This is a spatial reference distinction to preserve during exact reproduction, not proof that a projection mismatch caused the timeout.

The next check uses `gee/03_stage6_T60_batch_QC_READ_ONLY.js`, a single CSV batch export from the historical Stage 3 image. It uses the same reconstructed `connectedPixelCount` maximum size 1024, eight-connectivity, threshold five pixels, and the same EPSG:32749 / 10 m area reducer. It exports only a summary table to Google Drive, without writing or overwriting any GEE assets. The export Task must be started by the author in the GEE Tasks panel. A successful Task output is needed before any live Stage 6 match is claimed.

## Update, 4 November 2026: completed batch QC

The author supplied the completed GEE batch CSV via Google Drive. Reconstructed Stage 3 T60 filtered area = **323.5819606929078 ha**, compared with the historical locked Stage 6 value **323.33406072288363 ha**. Difference = **+0.2478999700241502 ha**. The reconstructed result agrees with the previously archived reviewer-folder output `Mojokerto_Stage7_POSTPATCH_Totals.csv` at floating-point precision, but not with the locked Stage 6 result. Recorded reducer EPSG:32749 at 10 m, original Stage 3 EPSG:4326, 5-pixel eight-connected components. Read the complete findings in [Stage 6 batch QC report](STAGE6_BATCH_QC_FINDINGS_2026-11-04.md), with the unchanged evidence CSV in `qa_outputs/Mojokerto_Stage6_T60_Batch_QC_Patch5_2026-11-04.csv`.

The independently archived locked Stage 6 GeoTIFF is available in the connected Drive figures folder and was previously audited as an EPSG:3857 raster. The projection difference is a hypothesis for investigation, not an established explanation. The Stage 6 historical estimate remains locked pending pixel-grid comparison.

## Update, 4 November 2026: original Stage 6 GeoTIFF independently checked

The preserved file `Mojokerto_Final_Conversion_Mask_Locked.tif` was fetched from the user's connected Google Drive and audited against the verified 304-unit shapefile. The original raster is EPSG:3857, 3696 by 5347 pixels, 10 m grid, affine `[10,0,12504720,0,-10,-815190]`, with 33,126 positive pixels. An independent WGS84 geodesic pixel-centre calculation produced 323.3343550679597 ha in administrative polygons, compared with the locked historical 323.33406072288363 ha (difference 0.00029434507604 ha). The result supports the plausibility of the historical locked raster but is not an exact GEE zonal reproduction.

The previously completed Stage 3 T60 reconstruction still yields 323.5819606929078 ha, exceeding the historical reference by 0.2478999700241502 ha. The source raster and historical final TIFF have different native grids. Grid/affine differences may contribute, but no causal explanation has yet been verified.

Read [full original locked TIFF audit](STAGE6_LOCKED_RASTER_OFFLINE_AUDIT_2026-11-04.md). Two additional scripts are available: `gee/04_inventory_historical_locked_assets_READ_ONLY.js` to discover a genuine historical Stage 6 asset under `users/fikriiyah26`, and `gee/05_stage6_locked_grid_district_BATCH.js` to compare masks on the original reference affine in one district after the locked asset is verified. The second script deliberately resamples Stage 3 before connectivity filtering and is an experimental sensitivity check, not a documented historical replay.

**Live GEE pixel-wise identity and the cause of the 0.24789997 ha discrepancy remain unverified.**

## Legacy asset discovery follow-up, 4 November 2026

The author ran the read-only legacy asset inventory under `users/fikriiyah26`. The output listed three potential conversion-related assets, but their names and types were still collapsed in the Console. Direct lookup of three guessed names returned Asset Not Found:

- `users/fikriiyah26/Mojokerto_Final_Conversion_Mask_Locked`
- `users/fikriiyah26/Mojokerto_Stage6_Final_Conversion_Mask`
- `users/fikriiyah26/Mojokerto_Stage6_T60_Patch5`

**These failures do not establish that no historical Stage 6 image exists under a different name.** The original inventory script was updated to print every matching candidate's full name, asset type, band names, projection and transform individually. No asset should be selected for raster comparison without checking its content. The locked GeoTIFF in Google Drive remains the fallback reference if none of the discovered candidates is a valid preserved Stage 6 image.


## Stage 6 locked image asset found, 4 November 2026

The author discovered an accessible `IMAGE` under the original legacy root `users/fikriiyah26`:

- `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`
- Band: `final_conv`
- Exact reported affine: `[10,0,12504720,0,-10,-815190]`

This matches the archived final GeoTIFF affine. The output did not expand the projection CRS, so the script will explicitly print `projection().crs()` before grid comparison. The previously guessed asset names were incorrect, rather than proof of missing historical Stage 6 data.

The corrected `gee/05_stage6_locked_grid_district_BATCH.js` uses the original GEE locked raster directly and creates one CSV task for Kecamatan Kutorejo. The comparison tests source masks and grid influence and does not modify either research image. Exact pixel identity of the GEE locked image with the Drive GeoTIFF and the origin of the reconstructed 0.24789997 ha difference are still awaiting evidence.

## Update, 4 November 2026: zero pixel disagreement in Kecamatan Kutorejo

The connected Google Drive folder `Mojokerto_GEE_Research` contains the completed CSV `Mojokerto_Stage6_Grid_QC_Kutorejo.csv`. The user-run GEE task compared the genuine historical image `users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1` against `conv_T60` from the original Stage 3 mask, reprojected onto the actual EPSG:3857 locked grid before applying the five-pixel eight-connected filter.

**Result for Kecamatan Kutorejo:** 2,830 historical pixels, 2,830 rebuilt pixels, zero mismatched pixel centres, zero historical-only or rebuilt-only pixels, and exactly equal GEE area of 27.630283154547215 ha for both masks. This provides direct, successful one-district grid-aligned pixel reproducibility.

The separate earlier EPSG:32749 batch result of 323.5819606929078 ha is not a proof of irrecoverable historical source disagreement. The candidate's grid alignment is now a plausible explanation for its differences, but all 18 districts remain to be verified. The next staged script is `gee/06_stage6_locked_grid_18_district_BATCH.js` with three district exports per run. See [Kutorejo pixel QC report](STAGE6_LOCKED_GRID_KUTOREJO_QC_2026-11-04.md) and the unchanged source CSV in `qa_outputs`.

The author's original locked Stage 6 raster, native CRS and affine are now verified, so there is no need to re-ingest the locked TIFF into GEE. **Global pixel identity and the complete historical Stage 1–6 workflow remain unverified.**


## Update, 4 November 2026: all 18 district grid-comparison batches complete

The author shared the connected Drive folder with all 18 completed `Mojokerto_Stage6_GridQC_XX` CSVs. Each was fetched and independently parsed.

- Districts checked: **18 of 18**
- Source administrative polygon parts: **308** covering the previously verified 304 distinct district-village keys
- Locked Stage 6 positive pixel centres within administrative district geometries: **33,113**
- Reconstructed Stage 3 positive pixel centres on identical grid: **33,113**
- Mismatched pixels: **0 in every district**
- Locked-only positive pixels: **0 in every district**
- Rebuilt-only positive pixels: **0 in every district**
- Pixel-centre geodesic area of either raster within all district geometries: **323.3343551699072 ha**
- CRS: **EPSG:3857**, transform `[10,0,12504720,0,-10,-815190]`
- Min. retained patch pixels: **5**, eight-connectivity **true**

The independent archived 304-village Stage 7 table was re-read. It records **304 unique villages, 230 positive T60 units, 18 districts and a 323.3340607228835 ha area-weighted total**. The small difference from the pixel-centre total is attributable to distinct boundary-pixel treatment. The two totals are not interchangeable.

**Stage 6 pixel-centre agreement on the entire tested 18-district administrative domain: PASS.** This does not verify every pixel outside those boundaries or end-to-end Stage 1 to Stage 5 source reconstruction. The evidence also strengthens the hypothesis that grid alignment contributed to the earlier +0.24789997 ha difference, although it does not isolate which grid-dependent operation was responsible.

See the full [18-district audit report](STAGE6_LOCKED_GRID_18_DISTRICTS_QC_2026-11-04.md) and [numeric summary with raw CSV source links](../qa_outputs/Mojokerto_Stage6_GridQC_18_District_Summary_2026-11-04.csv).
