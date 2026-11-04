# Stage 8: T50 and T70 sensitivity reprojection and weighted-area verification

**Registration date:** 4 November 2026

**Status:** Prepared. The reconstructed sensitivity masks have **not yet been evaluated in a fresh GEE export**. Historical Stage 7 T50 and T70 figures are verified as an internally consistent archived table, but are not yet reproduced from the original Stage 3 image.

## Previously verified T60 evidence

- Original historical Stage 3 source: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`.
- Actual locked Stage 6 T60 reference: `users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, band `final_conv`.
- Locked reference projection: `EPSG:3857`, affine `[10, 0, 12504720, 0, -10, -815190]`.
- Stage 3 T60 aligned to the locked grid before applying the five-pixel eight-connected patch rule yielded zero pixel-centre mismatches in all 18 tested district geometries.
- Fresh GEE masked weighted zonal reductions of the original locked T60 image reproduced all **304** historical village T60 areas and **230** positive units at numerical precision.
- The valid area method uses `ee.Image.pixelArea()/10000` and `updateMask` on a positive pixel mask. A previous zero-filled multiplication returned small area discrepancies. The single-band `reduceRegions(sum)` output was named `sum`, not the assumed image band name.
- A **multi-band** `reduceRegions(sum)` control returned band-named areas in the verified six-village diagnostic. Stage 8 uses four bands, which also helps preserve field identifiers.

## Historical reference table

`data_derived/Stage7_304_Units_From_18_District_Exports.csv`, obtained from 18 original district records and merged from 308 original polygon parts.

| Threshold | Historical total area (ha) | Historical positive units |
| --- | ---: | ---: |
| T50 | 610.9156963323798 | 261 |
| T60 | 323.33406072288363 | 230 |
| T70 | 89.0284436968486 | 128 |

Historical areas follow T50 >= T60 >= T70 for all 304 administrative units. This archived consistency does not verify fresh raster processing.

The earlier reviewer-folder sensitivity totals, T50 = 610.40558968762 ha and T70 = 89.29731210208661 ha, are discordant and must not replace the locked historical threshold figures without a separate explanation.

## Experimental Stage 8 workflow

Source script: `gee/09_stage7_T50_T70_locked_grid_sensitivity_BATCH.js`.

1. Select `conv_T50`, `conv_T60` and `conv_T70` from the original Stage 3 multi-band image.
2. For each threshold, convert to 0/1, reproject onto the original Stage 6 locked EPSG:3857 image grid **before connected-component filtering**, and apply `connectedPixelCount({maxSize:1024, eightConnected:true}) >= 5`.
3. Assemble four masked pixel area bands in hectares: `area_T50_ha`, `area_T60_rebuilt_ha`, `area_T60_locked_ha` and `area_T70_ha`. The original T60 locked band is an independent pixel-mask control and is not used as a T50 or T70 surrogate.
4. Apply weighted `ee.Reducer.sum()` with the locked source projection to original 308 polygon parts, preserving their administrative name keys.
5. Export one district CSV per GEE Task with four area columns and four null flags. Flagged or blank area values are not accepted as verified data.
6. Combine the four multipart units and compare all 304 per-unit values with the historical T50/T60/T70 records, including zero-valued villages.

**Historical locked T50/T70 IMAGE assets were not separately confirmed in the inventoried GEE root.** A successful area match from Stage 3 does not prove pixel-by-pixel identity with an independently preserved final T50 or T70 raster.

## Pilot gate: Kecamatan Kutorejo

Use `BATCH_START = 8` and `BATCH_COUNT = 1`, which produces:
`Mojokerto_Stage8_ThresholdGrid_09_Kutorejo.csv`.

The previously archived 17-unit reference in Kecamatan Kutorejo is:

| Measure | T50 | T60 | T70 |
| --- | ---: | ---: | ---: |
| Area (ha) | 55.51071220490999 | 27.63093313694076 | 5.867751710013591 |
| Positive units | 17 | 16 | 10 |

The pilot must pass each of the following:
- Exactly 17 unique source village keys matching the archived district records.
- No missing/null-flagged area values, invalid area values or negative values.
- All T50 and T70 per-village areas agree with the archive within **0.000001 ha**.
- Rebuilt T60 and locked original T60 are independently compared and agree with historical per-village areas within **0.000001 ha**.
- T50 >= T60 >= T70 for each village within a tolerance of 0.000001 ha.
- District weighted totals and positive-unit counts agree with the specified three-threshold references.

**Do not run the complete 18 districts before the pilot passes.** If it fails, inspect the per-village differences and candidate-filter grid before modifying the original method. Do not force agreement by copying archived values into the fresh file.

## After successful pilot

Change `BATCH_START` to 0, 3, 6, 9, 12 and 15 with `BATCH_COUNT = 3` in six GEE Code Editor runs. Because the 09_Kutorejo pilot may already exist, do not create duplicate files for it. Use only one complete set of uniquely numbered 18 files in the final comparison. All original assets are read-only.

Run `tools/check_stage8_threshold_sensitivity_exports.py` with `--mode full` and compare against `data_derived/Stage7_304_Units_From_18_District_Exports.csv`. Full criteria: 308 polygon parts, 304 unique keys, four known multipart units, positive-unit counts of 261, 230, 128, totals of 610.9156963, 323.3340607, 89.0284437 ha, and per-unit errors no greater than 0.000001 ha. The control T60 rebuilt raster must agree with original locked T60 by village.

## Limitations

Only if this additional work passes may the T50/T70 Stage 7 **administrative-area sensitivity derivation** be described as freshly reproduced from Stage 3. It will still not independently re-execute initial Dynamic World classification, Stage 5 field accuracy validation, sensitivity-specific output/production economics, or Moran/LISA spatial tests.

Official Earth Engine method references:
- https://developers.google.com/earth-engine/apidocs/ee-image-connectedpixelcount
- https://developers.google.com/earth-engine/apidocs/ee-image-reduceregions
- https://developers.google.com/earth-engine/guides/reducers_weighting
