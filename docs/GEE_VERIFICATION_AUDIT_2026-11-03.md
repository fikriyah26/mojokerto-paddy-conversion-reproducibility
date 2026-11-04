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


## Next Stage 7 verification registered, 4 November 2026

The original locked Stage 6 T60 IMAGE is now the source of a newly prepared, unexecuted 18-district weighted zonal rerun using `gee/07_stage6_locked_304_village_weighted_BATCH.js`. The workflow avoids the Stage 6 raster recomputation and instead calls `ee.Reducer.sum()` on masked `ee.Image.pixelArea()/10000`, at the locked source image's native projection, for each of the 308 source polygon pieces. It exports one district CSV per batch Task. The four multipart villages will be merged OFFLINE into 304 keys and compared against `data_derived/Stage7_304_Units_From_18_District_Exports.csv`.

Acceptance thresholds: 308 source parts, 304 unique units, 18 districts, exactly 230 positive T60 units, total area matching historical 323.33406072288363 ha within 0.000001 ha, and every per-unit area matching within 0.000001 ha. The Python verifier is `tools/check_stage6_village_weighted_exports.py`. See [registered next verification procedure](STAGE6_304_VILLAGE_WEIGHTED_RERUN_PLAN_2026-11-04.md).

**No fresh administrative area results have been claimed yet.** The completed 18-district zero-pixel-mismatch result is a separate unweighted pixel-centre comparison, not a substitute for this weighted zonal rerun.


## Stage 7 weighted village-area exports: blank-column failure, 4 November 2026

The author completed the 18 `Mojokerto_Stage6_VillageWeighted_XX` GEE CSV exports from the original locked Stage 6 image. All 18 CSVs were fetched from the connected `Mojokerto_GEE_Research` folder.

- Administrative coverage passed: **308** polygon parts, **304** unique district-village keys, all **18** districts, four expected multipart units.
- Numeric content failed: **all 308 values in `area_T60_ha` were blank**.
- Thus these exports provide **no** fresh area totals and cannot verify the 230 positive units. Blank cells must not be treated as zero.
- The original `gee/07_stage6_locked_304_village_weighted_BATCH.js` wrote the field by accessing `f.get('area_T60_ha')` after a single-band `reduceRegions` operation. Whether the reducer returned the value under that property or another property is not yet verified.
- The audit and source CSV observations are detailed in [Stage 7 null-field QC](STAGE7_WEIGHTED_EXPORT_NULL_FIELD_QC_2026-11-04.md).
- A read-only single-village property diagnostic has been prepared: `gee/07a_diagnose_weighted_reducer_output_READ_ONLY.js`.
- A corrective **one-district** test is prepared: `gee/07b_test_weighted_Kutorejo_DIRECT_REDUCE.js`, which uses individual `reduceRegion` calls to obtain the named area property explicitly. Known positive reference: Kecamatan Kutorejo / Pesanggrahan, **7.383299456212667 ha**.
- The local CSV comparison checker was updated to reject blank numeric fields. No GEE re-export success has been claimed.

The previously verified 18-district pixel-centre raster agreement and archived 304-unit/230-positive historical statistics remain intact and must be distinguished from this unsuccessful fresh weighted rerun.


## Stage 7 corrective Kutorejo rerun, 4 November 2026

The author ran the corrective one-district GEE test `gee/07b_test_weighted_Kutorejo_DIRECT_REDUCE.js`, with source `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1` band `final_conv` on native EPSG:3857 grid, transform `[10,0,12504720,0,-10,-815190]`.

Console observation: 17 district polygon parts, Desa Pesanggrahan historical 7.383299456212667 ha, fresh GEE 7.38329945621264 ha (difference approximately -2.66e-14 ha).

The completed `Mojokerto_Stage7_WeightedFix_Test_09_Kutorejo.csv` from Drive has 17 nonblank numeric area rows. Full unit-level comparison with the original archived Stage 7 table shows **12 units pass, 5 fail** the 0.000001 ha tolerance threshold. The five discrepancies concern Desa Kepuhpandak, Desa Windurejo, Desa Wonodadi, Desa Kaligoro, and Desa Kepuharum. The fresh district total is 27.62622332265515 ha versus 27.63093313694076 ha in the historical table, delta -0.00470981428561 ha.

The prior all-blank CSV failure has been fixed for this one district, but **the area-weighted 304-unit historical reproduction is NOT YET VERIFIED** and a full 18-district rerun using the direct reduction method is **not recommended**. Investigate mask treatment and reducer interfaces using `gee/07c_compare_masked_zonal_methods_Kutorejo.js`. No specific cause has been proven. Full results and source evidence appear in [the Stage 7 QC log](STAGE7_WEIGHTED_EXPORT_NULL_FIELD_QC_2026-11-04.md) and `qa_outputs/Mojokerto_Stage7_Kutorejo_PerVillage_Differences_2026-11-04.csv`.

Previous zero-mismatch 18-district raster pixel-centre QC remains valid and is methodologically distinct.


## Six-village diagnostic resolved the Stage 7 weighted-export discrepancies (4 November 2026)

The completed author-run CSV `Mojokerto_Stage7_Weighted_Methods_QC_Kutorejo.csv` was retrieved from
https://drive.google.com/file/d/1ilajWGLKuW1dDrxuERxFdvdy00H2BJqe/view
and archived in `qa_outputs/Mojokerto_Stage7_Weighted_Methods_QC_Kutorejo_2026-11-04.csv`.

All six reference areas in Kecamatan Kutorejo match their original Stage 7 historical values when the area input uses masked `ee.Image.pixelArea()/10000` with `updateMask(locked.eq(1).selfMask())`. Five of the six values differ when zero-filled `locked.eq(1).unmask(0)` is multiplied into pixelArea. The mask handling is therefore a verified methodological difference for these six samples.

The initial batch export's 308 blank area values came from an incorrect assumed output property: single-band `ee.Image.reduceRegions(ee.Reducer.sum())` returned `sum`, not `area_T60_ha` in the author-run diagnostic. The three-band control returned a band-named `area_T60_ha` property.

A corrected script `gee/07d_stage7_weighted_corrected_18_district_BATCH.js` is registered and configured for a **single-district** test first, using retained masks, weighted `reduceRegions`, and the empirically verified `sum` property. The obsolete `gee/07_stage6_locked_304_village_weighted_BATCH.js` was marked deprecated. Updated `tools/check_stage6_village_weighted_exports.py` checks the corrected filename prefix, rejects blank areas and compares the complete 304 keys, positive-unit count and per-unit values to the historical archive.

**The full corrected 18-district zonal rerun has not yet been performed.** Do not claim fresh verification of 230 positive units until corrected outputs exist.


## Stage 7 corrected native-grid weighted areas, Kecamatan Kutorejo: PASS (4 November 2026)

The corrected author-run GEE task `Mojokerto_Stage7_WeightedCorrected_09_Kutorejo` was completed and its CSV fetched from https://drive.google.com/file/d/1O2JmoMWbgOcnm9rkB4h7nuyRqrDmzQ5d/view. This rerun retains `updateMask` on the original Stage 6 locked raster and reads the single-band reducer property `sum`.

For the 17 original polygon features in Kecamatan Kutorejo, all 17 fields contain numeric areas, `raw_sum_missing` is 0 throughout, and all 17 values match the corresponding archived Stage 7 records within the preregistered 0.000001 ha tolerance. There are 16 positive-conversion villages. The fresh and archived weighted district sums are both **27.63093313694076 ha**. Maximum absolute unit-level difference: **4.440892098500626e-16 ha**.

The unchanged exported CSV is in `qa_outputs/Mojokerto_Stage7_WeightedCorrected_09_Kutorejo_2026-11-04.csv`. See [full Kutorejo verification](STAGE7_CORRECTED_KUTOREJO_PASS_2026-11-04.md).

The next script `gee/07e_stage7_weighted_corrected_remaining_17_districts_BATCH.js` processes the remaining 17 districts in six batch runs, automatically skipping the verified Kecamatan Kutorejo export. Global fresh Stage 7 304-unit weighted-area reproduction and 230-positive-unit count remain **pending** until those new district CSVs have been checked.


## Final Stage 7 T60 verification: all 304 units PASS (4 November 2026)

The author completed 17 additional `WeightedCorrected` GEE district exports following the previously successful Kecamatan Kutorejo test, and the connected Drive folder now contains **18 uniquely numbered corrected CSVs**. All were read and independently compared to the archived 304-unit T60 Stage 7 table.

**Source assets and method:** Original `users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, band `final_conv`, native EPSG:3857 grid. Corrected weighted zonal method retains the positive conversion mask using `updateMask`, uses `ee.Reducer.sum()`, and reads the single-band GEE reducer output property `sum`.

**Results:**
- Original polygons **308** across **18** districts, merged into **304** unique `KECAMATAN + DESAKEL` units
- Exactly **230** units with positive area, identical to historical
- No blank areas, no negative values, no nonzero `raw_sum_missing` flags
- All four historic multipart villages grouped correctly
- **304 of 304** unit-area values match the original archived values at an absolute tolerance of **0.000001 ha**
- Maximum absolute unit-level difference **3.552713678800501e-15 ha**
- Fresh total **323.3340607228835 ha**, historical archived total **323.3340607228835 ha**, locked manuscript reference **323.33406072288363 ha**

**Status upgraded:** Full fresh, original-raster-to-Stage-7 **T60 304-unit weighted-area reproduction PASS**. This supersedes the *pending* statements from earlier, dated audit sections, which are retained to show the sequence of debugging and tests.

See [the final 304-unit verification report](STAGE7_304_VILLAGES_FRESH_GEE_WEIGHTED_PASS_2026-11-04.md), [raw source 308 polygon rows with per-file Drive IDs](../qa_outputs/Mojokerto_Stage7_WeightedCorrected_All308_Parts_2026-11-04.csv), and [304-unit per-village comparison](../qa_outputs/Mojokerto_Stage7_WeightedCorrected_304_Unit_Comparison_2026-11-04.csv).

**Scope limitation:** This is not a claim of independently replayed Stage 1–3 Dynamic World classification, Stage 5 field-validation work, or separate T50/T70 raster processing. It establishes exact numerical agreement of the T60 area outputs from a preserved historical source raster and administrative geometry.


## Stage 8 sensitivity T50 and T70: pilot prepared, results not yet run (4 November 2026)

Following the successful fresh original-raster T60 verification (304 of 304 units), the next test is to reconstruct the T50 and T70 threshold masks from the original GEE Stage 3 asset on the verified EPSG:3857 locked T60 grid. The original Stage 7 sensitivity table contains T50 = **610.9156963323798 ha** in **261** positive administrative units, and T70 = **89.0284436968486 ha** in **128** positive units. The original T60 reference is **323.33406072288363 ha** in **230** units. These sensitivity figures are **historical references**, not yet freshly reproduced.

A new GEE script `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js` computes candidate 5-pixel eight-connected masks for all three Stage 3 thresholds on the locked native grid before patch filtering, retains each positive mask via `updateMask`, and computes weighted pixel-area sums with four multiband outputs. The outputs are T50, rebuilt T60, original locked T60 control and T70. The script creates only derived Drive CSV Tasks and never overwrites GEE source assets.

The script is initially configured to export **one pilot district**, Kecamatan Kutorejo, for which the historical 17-unit weighted-area references are: T50 **55.51071220490999 ha** (17 positive units), T60 **27.63093313694076 ha** (16 positive), T70 **5.867751710013591 ha** (10 positive). The pilot must match every historical per-village value within 0.000001 ha. Only upon passing should the other 17 districts be processed.

The Python script `tools/check_stage8_threshold_sensitivity_exports.py` checks pilot and complete exports against the historic 304-unit CSV, including all area values, threshold monotonicity, source T60 control, raw null flags, multipart keys, and positive counts. See [registered Stage 8 protocol](STAGE8_T50_T70_SENSITIVITY_VERIFICATION_PLAN_2026-11-04.md).

**Status: Stage 8 GEE pilot is READY TO RUN, not completed.** Historical T50 and T70 raster identity is not established by the existence of the Stage 3 source asset or by the passed T60 check alone.


## Stage 8 T50 and T70 pilot, Kecamatan Kutorejo: PASS (4 November 2026)

The author executed `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js` for district index 8, Kecamatan Kutorejo, and provided a completed 17-village CSV from https://drive.google.com/file/d/1G2T0q-6D-nxJN5fdP6-mZby3_0LQrqEM/view. This was retrieved and compared against the archived `data_derived/Stage7_304_Units_From_18_District_Exports.csv`.

T50 fresh district total **55.510712193694026 ha** versus historical **55.51071220490999 ha**, 17 positive villages. T60 rebuilt and original locked controls both **27.630933147007784 ha** versus historical **27.63093313694076 ha**, 16 positive villages. T70 fresh **5.867751704967198 ha** versus historical **5.867751710013591 ha**, 10 positive villages.

All **17 of 17 village-level values** match reference within the preregistered **0.000001 ha absolute per-unit tolerance** for all three threshold series. Maximum absolute differences: T50 **4.479571025228779e-8 ha**, T60 **2.614737137918155e-8 ha**, T70 **2.4010238686145158e-8 ha**. Rebuilt T60 equals original locked T60 for every pilot unit, all null flags are zero and threshold monotonicity is preserved.

The full author-run pilot file and 17-unit comparison have been archived in `qa_outputs`. See the [Stage 8 pilot report](STAGE8_T50_T70_KUTOREJO_PILOT_PASS_2026-11-04.md).

**Current status:** T50/T70 sensitivity pilot PASS, but the full 304-unit T50/T70 rerun is not yet verified. Next action is to run the remaining 17 district CSV exports in six batches. The script automatically skips the already validated Kecamatan Kutorejo pilot in full batches and does not write Earth Engine assets.


## Stage 8 full 304-unit T50 and T70 sensitivity verification: PASS (4 November 2026)

After the successful Kecamatan Kutorejo pilot, the author ran the remaining 17 district GEE batches using `gee/10_stage8_T50_T70_remaining_17_district_BATCH.js`, and all 18 files were read from the connected Google Drive folder.

- 18 complete district CSVs, 308 polygon parts, 304 distinct district-village keys
- Four historical multipart keys grouped correctly
- No area nulls, missing flags, negative values or unknown administrative keys
- Reconstructed T60 equals original locked T60 for every part and unit
- Each of the 304 unit areas matches archived T50, T60 and T70 within the registered 0.000001 ha tolerance
- Positive unit counts T50 **261**, T60 **230**, T70 **128**, all consistent with historical Stage 7
- Fresh GEE T50 area **610.9156962921805 ha**, archive **610.9156963323795 ha**
- Fresh GEE T60 original locked control area **323.33406086654634 ha**, archive **323.3340607228835 ha**
- Fresh GEE T70 area **89.02844375957753 ha**, archive **89.02844369684854 ha**
- Maximum absolute unit differences T50 **7.270535284931157e-8 ha**, T60 **5.667411384635557e-8 ha**, T70 **3.751664934270593e-8 ha**
- Threshold area ordering T50 >= T60 >= T70 verified for all 304 units

**Status upgraded:** T50/T70 Stage 8 sensitivity weighted administrative area rerun PASS across all 304 units. This supersedes the earlier *pilot only / remaining districts pending* entries and is backed by a fresh GEE run, not merely archival reconciliation.

See [full Stage 8 sensitivity PASS report](STAGE8_T50_T70_304_VILLAGES_FRESH_GEE_PASS_2026-11-04.md), [308 raw derived source rows with Drive source IDs](../qa_outputs/Mojokerto_Stage8_ThresholdGrid_All308_Parts_2026-11-04.csv) and [304 unit-level comparisons](../qa_outputs/Mojokerto_Stage8_ThresholdGrid_304_Unit_Comparison_2026-11-04.csv).

**Remaining limitations:** No independently preserved historical final T50/T70 IMAGE asset was found for pixel-by-pixel equality testing. Initial Stage 1–3 Dynamic World classification, Stage 5 validation and productivity/economic/spatial calculations still require separate reproductions.


## Stage 9 rice-capacity and gross-output arithmetic: PASS (4 November 2026)

Economic calculations were independently executed from the successful 304-unit Stage 8 GEE area outputs and the historical model's village cropping-index inputs in Library workbook `Mojokerto_Foregone_Rice_Production_Sensitivity.xlsx`.

The 304 units comprise 230 locked T60 coefficients, 31 provisional T50-only coefficients derived from observed 2024 BPS village cropping intensities using the historical treatment rules, and 43 with no conversion under any of the three thresholds. Two provisional T50 raw intensities were capped at 3.0, and the original 230 T60 model had two district-median imputations and one cap.

The 2025 production-input model uses 51,750 harvested ha, 312,410 t GKG and 180,390 t food rice. Its regional yield and effective GKG-to-rice conversion are derived as ratios. The rice price is the manuscript's documented full-precision 2025 national medium-rice mill-level price of IDR 12,984.88809 per kg.

| Threshold | Fresh rice capacity (t/y) | Fresh gross output equivalent (IDR/y) | Historical rice capacity (t/y) | Historical gross output (IDR/y) |
| --- | ---: | ---: | ---: | ---: |
| T50 | 3144.451679350694 | 40830353160.78133 | 3144.451679092195 | 40830353158.2001 |
| T60 | 1628.678278715752 | 21148205183.73786 | 1628.6782775339984 | 21148205168.794533 |
| T70 | 429.8339095594595 | 5581345212.916761 | 429.8339091474901 | 5581345207.673375 |

All modelled totals pass the registered tolerance of 0.00001 t/year for rice and IDR 100/year for gross output. The largest monetary residual is about IDR 14.94 per year. The fresh 230-unit T60 village rice capacities also match the historical `Foregone_Desa` workbook tab within about 3.78e-7 t/year per unit.

The 31 provisional T50-only units account for about 7.16898843 ha and 33.28539017 t/year, consistent with the manuscript's rounded 7.16899 ha and 33.28539 t/year. The 43 zero-conversion units contribute no economic value.

See [full Stage 9 methods and verification report](STAGE9_RICE_CAPACITY_AND_GROSS_OUTPUT_FRESH_GEE_VERIFICATION_2026-11-04.md), [model coefficient evidence](../data_derived/Stage9_Rice_Coefficients_304_Units_2026-11-04.csv), [304-unit economic outputs](../qa_outputs/Mojokerto_Stage9_FreshGEE_304_Unit_Rice_Economics_2026-11-04.csv), and [3-threshold summary and numerical residuals](../qa_outputs/Mojokerto_Stage9_Rice_Economics_Summary_2026-11-04.csv). A standalone Python implementation is registered at `tools/verify_stage9_rice_economics.py`.

**Important distinction:** PASS is for numerical reproduction conditional on the documented cropping-intensity treatments, regional production inputs and manuscript full-precision milling-level price. It does not demonstrate independent reconstruction of unrounded national monthly prices from BPS public tables, upstream historical Dynamic World classification, original map validation, causal rice loss, or farmers' realized income. These remain separate provenance and inference limits.

Next planned independent test is the global and local spatial analysis, including separate annual rice-capacity and per-hectare variables and any local FDR correction.
