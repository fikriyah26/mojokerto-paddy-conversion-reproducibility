# Corrected weighted Stage 7 result, Kecamatan Kutorejo

**Author-run Earth Engine evidence date:** 4 November 2026

## Input and provenance

- Original GEE locked Stage 6 IMAGE: `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`
- Band: `final_conv`
- Historical grid: `EPSG:3857`, affine `[10,0,12504720,0,-10,-815190]`
- Original 308-part administrative FeatureCollection imported as `table`
- Corrected Stage 7 method: `gee/07d_stage7_weighted_corrected_18_district_BATCH.js`
- Uses `ee.Image.pixelArea().divide(10000).updateMask(locked.eq(1).selfMask())`, weighted `ee.Reducer.sum()` on native grid, and empirically verified single-band output property `sum`.
- Drive CSV: https://drive.google.com/file/d/1O2JmoMWbgOcnm9rkB4h7nuyRqrDmzQ5d/view
- Unchanged copy: `qa_outputs/Mojokerto_Stage7_WeightedCorrected_09_Kutorejo_2026-11-04.csv`
- Historical reference: `data_derived/Stage7_304_Units_From_18_District_Exports.csv`

## Verified results

| Measure | Fresh GEE | Historical reference |
| --- | ---: | ---: |
| District polygons | 17 | 17 |
| Distinct units | 17 | 17 |
| Positive-conversion units | 16 | 16 |
| Nonblank area entries | 17 | 17 |
| `raw_sum_missing` flagged entries | 0 | Not applicable |
| District weighted area ha | 27.63093313694076 | 27.63093313694076 |
| Per-village values passing 0.000001 ha tolerance | 17 of 17 | 17 of 17 |
| Maximum absolute per-village difference ha | 4.440892098500626e-16 | Not applicable |

The fresh GEE weighted-area results exactly reproduce the 17 archived Kutorejo village areas to normal floating-point precision. This is separate from the previous 18-district unweighted pixel-centre agreement.

## Next registered action

Use `gee/07e_stage7_weighted_corrected_remaining_17_districts_BATCH.js`. It is preconfigured with `BATCH_START=0` and `BATCH_COUNT=3`, and skips district index 8 (Kecamatan Kutorejo) because its validated CSV is already in Drive. Execute in six start-index batches 0, 3, 6, 9, 12, 15 and start the generated Drive tasks. This produces 17 additional CSVs rather than duplicating Kutorejo.

After all 18 uniquely numbered corrected CSVs are available, combine 308 polygon parts into 304 district-village units, verify the 4 multipart keys and 230 positive units, and check that every unit and the aggregate match the historical reference to 0.000001 ha. The Python checker is `tools/check_stage6_village_weighted_exports.py`, which recognizes the corrected filename prefix.

**Status:** One-district corrected Stage 7 weighted-area verification PASS. Remaining 17 districts NOT YET VERIFIED by fresh GEE weighted export. Do not claim complete fresh reproduction or independent Stage 1–3 classification.
