# Original Stage 6 to Stage 7 weighted T60 area verification: 304 units PASS

**Verification date:** 4 November 2026

## Summary of confirmed results

Fresh author-run GEE area reductions using the **genuine historical locked Stage 6 asset** reproduced the historical Stage 7 village-level T60 table across all 18 kecamatan of Kabupaten Mojokerto. The new source CSVs were retrieved directly from the connected Google Drive folder:

https://drive.google.com/drive/folders/1i60YJHaWVNFUIWUi_FEa4cX0uObQB6Z9

The following new evidence outputs are preserved in this private repository:

- `qa_outputs/Mojokerto_Stage7_WeightedCorrected_All308_Parts_2026-11-04.csv`: all 308 new polygon-part area rows, with individual source Drive file names and IDs, and `raw_sum_missing` diagnostics
- `qa_outputs/Mojokerto_Stage7_WeightedCorrected_304_Unit_Comparison_2026-11-04.csv`: aggregated 304 district-village units, historical comparison, per-unit residuals and pass indicators
- `data_derived/Stage7_304_Units_From_18_District_Exports.csv`: original reconciled historical 304-unit area table

## GEE source and registered method

- Original GEE raster: `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`
- Band: `final_conv`
- Native projection: `EPSG:3857`, transform `[10,0,12504720,0,-10,-815190]`
- Original administrative source: 308 polygon-part features with `KECAMATAN` and `DESAKEL`
- Pixel area image: `ee.Image.pixelArea().divide(10000).updateMask(locked.eq(1).selfMask()).rename('area_T60_ha').toDouble()`
- GEE area reducer: `ee.Reducer.sum()` with native projection, `tileScale:16`
- Single-band `reduceRegions` output property: `sum` (not `area_T60_ha`). Source exports materialize numeric area from `sum` and retain `raw_sum_missing` as a separate check.
- Corrected batch source: `gee/07d_stage7_weighted_corrected_18_district_BATCH.js`, followed by `gee/07e_stage7_weighted_corrected_remaining_17_districts_BATCH.js`

The initial 18 exports with blank area fields and the subsequent zero-filled-method five-village discrepancies were resolved by a six-village methodological diagnostic. That diagnostic verified both the correct reducer output name and the importance of preserving the native positive-class mask.

## Verification criteria and observed outcomes

| Criterion | Observed | Status |
| --- | ---: | --- |
| Corrected CSVs retrieved | 18 of 18 | PASS |
| Original polygon parts | 308 | PASS |
| Unique district-village units | 304 | PASS |
| Distinct kecamatan | 18 | PASS |
| Identical unit keys versus reference | 304 of 304 | PASS |
| Missing or blank corrected area fields | 0 | PASS |
| Nonzero `raw_sum_missing` flags | 0 | PASS |
| Negative area values | 0 | PASS |
| Known multipart village units | 4 of 4 | PASS |
| Positive T60 units | 230 | PASS |
| Historical positive T60 units | 230 | PASS |
| Absolute per-unit area delta above 0.000001 ha | 0 of 304 | PASS |
| Largest absolute per-unit difference | 3.552713678800501e-15 ha | PASS |
| Fresh weighted T60 total | 323.3340607228835 ha | PASS |
| Historical reconciled weighted total | 323.3340607228835 ha | PASS |
| Locked manuscript reference | 323.33406072288363 ha | PASS within floating-point rounding |

The sum of signed per-unit differences was about +2.4754571764824818e-15 ha. Both fresh and historical totals round to **323.3341 ha**, the correct T60 figure for the manuscript.

Known multipart names, grouped by `KECAMATAN + DESAKEL`:
1. Kecamatan Gedeg, Desa Ngareskidul
2. Kecamatan Gondang, Desa Kemasantani
3. Kecamatan Jetis, Desa Mojorejo
4. Kecamatan Mojosari, Desa Seduri

## District totals from the new, corrected GEE weighted CSVs

| District | Original polygon parts | Area T60 (ha) |
| --- | ---: | ---: |
| Kecamatan Bangsal | 17 | 11.494058112140731 |
| Kecamatan Dawarblandong | 18 | 3.7862477161542105 |
| Kecamatan Dlanggu | 16 | 13.558497493079695 |
| Kecamatan Gedeg | 15 | 10.784064437480254 |
| Kecamatan Gondang | 19 | 10.726923574066165 |
| Kecamatan Jatirejo | 19 | 7.301488007471421 |
| Kecamatan Jetis | 17 | 24.267013480272485 |
| Kecamatan Kemlagi | 20 | 11.996755549313415 |
| Kecamatan Kutorejo | 17 | 27.63093313694076 |
| Kecamatan Mojoanyar | 12 | 6.05540137014052 |
| Kecamatan Mojosari | 20 | 18.76448574809056 |
| Kecamatan Ngoro | 19 | 24.668803736850514 |
| Kecamatan Pacet | 20 | 22.154400000290217 |
| Kecamatan Pungging | 19 | 29.890821619792256 |
| Kecamatan Puri | 16 | 46.21430972401043 |
| Kecamatan Sooko | 15 | 31.338336792141796 |
| Kecamatan Trawas | 13 | 18.512684647677556 |
| Kecamatan Trowulan | 16 | 4.1888355769707175 |

## Meaning for research reproducibility

**CONFIRMED:** Using the existing, archived GEE Stage 6 locked raster and the original administrative geometry, the corrected area-reduction method regenerates all 304 historical unit-level T60 values to numerical precision. The original manuscript's 230-positive-unit and 323.3340607-ha T60 values are now supported by a fresh, author-executed GEE reduction rather than solely a historical CSV reconciliation.

**Separately confirmed:** Stage 3 T60 five-pixel connected-component reconstruction aligned to the locked Stage 6 grid yielded **zero mismatched pixel centres** within each of the 18 district test geometries. See `docs/STAGE6_LOCKED_GRID_18_DISTRICTS_QC_2026-11-04.md`.

**Still NOT confirmed:** An independent full end-to-end replay of original Dynamic World Stage 1 through Stage 3 classification, Stage 5 validation, complete raster identity outside administrative boundaries, threshold-specific T50 and T70 analytical reruns, and economic or spatial inferential calculations. No more numerical claims should be generalized beyond the tests conducted.

Previous 323.5819607 ha reviewer-postpatch figure is not adopted as the locked historical T60 estimate. The corrected native grid and mask treatment reconcile Stage 6 and Stage 7, but a single causal explanation for every earlier divergent processing workflow has not been isolated.

## Release status

Private GitHub evidence archive only. No public DOI or open release is implied by this PASS result. Third-party data redistribution and manuscript claims must be checked independently prior to release.
