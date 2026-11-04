# Stage 8 T50 and T70 sensitivity area verification, 304 units PASS

**Evidence date:** 4 November 2026

## Scope and source lineage

The author completed all 18 GEE Stage 8 district exports, saved in the connected Google Drive folder:
https://drive.google.com/drive/folders/1i60YJHaWVNFUIWUi_FEa4cX0uObQB6Z9

All 18 files matching `Mojokerto_Stage8_ThresholdGrid_XX_District.csv` were fetched and independently evaluated against the original archived 304-unit Stage 7 table.

The unchanged original Stage 3 image was `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`, bands `conv_T50`, `conv_T60`, and `conv_T70`. The reference T60 IMAGE was `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, band `final_conv`. The locked source grid was EPSG:3857, affine `[10, 0, 12504720, 0, -10, -815190]`.

The experimental method reconstructed each threshold on that exact historical grid **before** the five-pixel, eight-connected patch filter. It then used masked pixel-area bands, `ee.Reducer.sum()` on the native locked projection and the original source administrative geometries. The `area_T60_rebuilt_ha` and `area_T60_locked_ha` bands were independently calculated as a control.

- Verified GEE source: `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js` and `gee/10_stage8_T50_T70_remaining_17_district_BATCH.js`
- Historical comparison: `data_derived/Stage7_304_Units_From_18_District_Exports.csv`
- Re-fetched original export rows with individual Google Drive file identifiers: `qa_outputs/Mojokerto_Stage8_ThresholdGrid_All308_Parts_2026-11-04.csv`
- Aggregated 304-unit per-threshold comparison with signed residuals and PASS flags: `qa_outputs/Mojokerto_Stage8_ThresholdGrid_304_Unit_Comparison_2026-11-04.csv`
- Pilot report: `docs/STAGE8_T50_T70_KUTOREJO_PILOT_PASS_2026-11-04.md`
- Registered per-unit acceptance tolerance: **0.000001 ha absolute difference**.

## Results

| Criterion | T50 | T60 locked | T70 |
| --- | ---: | ---: | ---: |
| Fresh GEE weighted area, ha | 610.9156962921805 | 323.33406086654634 | 89.02844375957753 |
| Archived Stage 7 weighted area, ha | 610.9156963323795 | 323.3340607228835 | 89.02844369684854 |
| Positive units, fresh | 261 | 230 | 128 |
| Positive units, archive | 261 | 230 | 128 |
| Units matching archive within tolerance | 304/304 | 304/304 | 304/304 |
| Maximum absolute unit-level difference, ha | 7.270535284931157e-8 | 5.667411384635557e-8 | 3.751664934270593e-8 |

Fresh reconstructed T60 total: **323.33406086654634 ha**, exactly the same as the fresh locked T60 control **at each of the 304 units**. Both differ slightly from the earlier single-band Stage 7 locked-raster sum of 323.3340607228835 ha, but the largest aggregate difference is approximately **1.44e-7 ha**, below the registered 1e-6 ha threshold. This is numerical agreement within tolerance, not bitwise-identical area computation.

## Additional independent structural checks

- 18 uniquely numbered district CSVs.
- 308 original administrative polygon parts.
- 304 unique `KECAMATAN + DESAKEL` keys and no missing or extra keys versus archived Stage 7.
- Four known multipart units grouped correctly: Desa Ngareskidul in Kecamatan Gedeg, Desa Kemasantani in Kecamatan Gondang, Desa Mojorejo in Kecamatan Jetis, and Desa Seduri in Kecamatan Mojosari.
- All numeric area fields finite and nonnegative.
- No blank area values and zero values for all four `missing_*` flag fields across all 308 exported polygon parts.
- T50 >= T60 >= T70 holds at all 304 units.
- Rebuilt T60 equals original locked T60 at all 304 units and for all exported polygon parts.
- No unit-area differences above the preregistered tolerance for any threshold.

**Overall Stage 8 result: PASS for all 304 threshold-specific administrative weighted area estimates.**

## Interpretation and scientific limits

The independent GEE threshold reconstruction from preserved **Stage 3** assets successfully reproduces the historical sensitivity area estimates in **Stage 7** under the locked Stage 6 grid. The manuscript may retain its reported threshold-area sensitivity figures: approximately T50 = 610.9157 ha, T60 = 323.3341 ha, T70 = 89.0284 ha, with 261, 230 and 128 positive administrative units.

This is **not** evidence that separately archived final T50 and T70 image assets were found or pixel-for-pixel compared. The GEE root asset inventory provided no verified independent final T50 or T70 raster. The work also does not independently rerun upstream Dynamic World classification, Stage 5 interpretation/accuracy data, annual foregone rice-production capacity, gross output value, or local spatial significance tests.

The alternative reviewer folder's divergent threshold totals are retained as provenance discrepancies, not substituted into the locked historical analysis.

## Next work

Proceed to independent recalculation of the historical per-unit/threshold annual rice-production capacity and gross output value, using the archived methodological assumptions for cropping intensity, yield, price and any source-level type classifications. Do not infer parameters merely to force agreement with published headline totals. Compare every derived value against the original workbook or export and document any remaining gaps before checking the Moran/LISA analysis.
