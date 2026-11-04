# Stage 8 T50 and T70 sensitivity verification: Kecamatan Kutorejo pilot PASS

**Author-run GEE pilot and evidence date:** 4 November 2026

## Source evidence

- GEE Stage 3 historical multiband asset: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`, bands `conv_T50`, `conv_T60`, `conv_T70`.
- Original locked Stage 6 T60 reference: `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, band `final_conv`.
- Native locked pixel grid: `EPSG:3857`, affine `[10, 0, 12504720, 0, -10, -815190]`.
- GEE method source: `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js`.
- User-run exported CSV: https://drive.google.com/file/d/1G2T0q-6D-nxJN5fdP6-mZby3_0LQrqEM/view.
- Unchanged saved evidence: `qa_outputs/Mojokerto_Stage8_ThresholdGrid_09_Kutorejo_2026-11-04.csv`.
- All 17 village comparisons: `qa_outputs/Mojokerto_Stage8_Kutorejo_17_Village_Sensitivity_Comparison_2026-11-04.csv`.
- Historical reference: `data_derived/Stage7_304_Units_From_18_District_Exports.csv`.

## Experimental procedure

Reproject each Stage 3 threshold to the original locked Stage 6 native EPSG:3857 grid **before** eight-connected, five-pixel minimum patch filtering. Compute four independently masked hectare area bands for T50, rebuilt T60, original locked T60 and T70. Use a weighted `ee.Reducer.sum()` against the original 17 village polygons of Kecamatan Kutorejo. Keep raw null flags for all four outputs.

This experiment directly tests Stage 3-derived T50 and T70 *administrative weighted areas*. The locked image serves only as a T60 control. No independent historical final T50 or T70 raster has been verified.

## Quantitative results

| Threshold | New pilot ha | Archived reference ha | Positive units |
| --- | ---: | ---: | ---: |
| T50 | 55.510712193694026 | 55.51071220490999 | 17 |
| Rebuilt T60 | 27.630933147007784 | 27.63093313694076 | 16 |
| Original locked T60 control | 27.630933147007784 | 27.63093313694076 | 16 |
| T70 | 5.867751704967198 | 5.867751710013591 | 10 |

**All 17 of 17 village keys** agree with the archived T50, T60 and T70 values at the predefined **0.000001 ha per-unit absolute tolerance**.

- Maximum per-unit absolute T50 difference: `4.479571025228779e-8 ha`
- Maximum per-unit absolute T60 difference: `2.614737137918155e-8 ha`
- Maximum per-unit absolute T70 difference: `2.4010238686145158e-8 ha`
- Rebuilt T60 equals original locked T60 within every evaluated administrative unit, including the summed district result.
- All four null-flag fields are zero on every village row.
- All areas are finite and nonnegative.
- T50 >= T60 >= T70 holds for all 17 village values.
- The number of positive units is 17 / 16 / 10 respectively.

The small differences from the archived values are several orders of magnitude below the preregistered tolerance, but should be described as numeric agreement **within tolerance**, not as strictly bitwise identical area values.

## Status and next step

**PILOT PASS: Yes.** The Stage 3 derived T50/T70 masks, native locked grid filtering and masked weighted zonal workflow reproduce all 17 reference village areas in Kecamatan Kutorejo within the specified tolerance.

**FULL 18-DISTRICT T50/T70 verification: PENDING.**

Use the existing `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js` and change `BATCH_START` successively to 0, 3, 6, 9, 12 and 15 with `BATCH_COUNT=3`. The script automatically skips district index 8 (the verified Kecamatan Kutorejo pilot) when `BATCH_COUNT>1`. Thus 17 new district CSVs must be created, then combined with the existing pilot to yield 18 uniquely numbered CSVs.

After exports, run `tools/check_stage8_threshold_sensitivity_exports.py --mode full` to verify all 308 original polygon parts, 304 merged units, four multipart villages and original Stage 7 totals:
- T50 610.9156963323798 ha, 261 positive units.
- T60 323.33406072288363 ha, 230 positive units.
- T70 89.0284436968486 ha, 128 positive units.

This pilot does not independently rerun upstream Dynamic World classification, Stage 5 validation, or economic and spatial analyses.
