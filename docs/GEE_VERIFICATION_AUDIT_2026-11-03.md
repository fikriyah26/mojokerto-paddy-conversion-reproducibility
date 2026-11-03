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
