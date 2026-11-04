# Stage 6 original locked T60: fresh 304-village weighted zonal verification

Prepared on 4 November 2026. **The fresh zonal rerun has not yet been executed or verified.** This is an execution plan and method registration, not a completed result.

## Why the next test is needed

The historical Stage 3 candidate, after alignment to the locked Stage 6 EPSG:3857 raster grid and a five-pixel eight-connected filter, yielded **zero mismatched pixel centres** in completed GEE exports for all 18 districts. The pixel-centre total was 323.3343551699072 ha within the administrative geometries, which is different from the archived 304-village **weighted** T60 area of 323.33406072288363 ha. These reflect distinct boundary-pixel inclusion rules and must not be substituted.

The archived original 18-district CSVs contain 308 polygon parts, collapsed offline to 304 distinct `KECAMATAN + DESAKEL` keys. The archived results report exactly 230 units with positive T60 area and a total near 323.33406072288363 ha.

## Original input image

`projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, band `final_conv`, native EPSG:3857 projection with affine `[10, 0, 12504720, 0, -10, -815190]`.

Administrative input: the 308-piece original boundary FeatureCollection imported as `table` in GEE Code Editor.

## Registered verification procedure

1. Run `gee/07_stage6_locked_304_village_weighted_BATCH.js` in six runs by changing `BATCH_START` to 0, 3, 6, 9, 12, 15 with `BATCH_COUNT=3`.
2. Start the three Google Drive CSV Tasks for each run. If a district task runs out of memory, use `BATCH_COUNT=1`.
3. Use `ee.Image.pixelArea().divide(10000).updateMask(locked.eq(1).selfMask()).rename('area_T60_ha')` and native `locked.projection()`, without changing the raster grid.
4. Use `areaImage.reduceRegions({collection: districtPolygons, reducer: ee.Reducer.sum(), crs: nativeProjection, tileScale: 16})` rather than `sum().unweighted()`. The default reducer applies fractional-pixel weighting at polygon edges.
5. Export original polygon-part rows (expected 308). Combine the four known multipart unit keys offline by summing `area_T60_ha`. Grouping keys are `KECAMATAN` and `DESAKEL`.
6. Run `tools/check_stage6_village_weighted_exports.py` against `data_derived/Stage7_304_Units_From_18_District_Exports.csv`.
7. Preserve original CSVs and capture any error, null area, missing key, positive-unit discrepancy or per-unit mismatch before concluding.

## Registered acceptance checks

- Exactly 18 district CSVs with one district each.
- Exactly 308 original polygon-part rows.
- Exactly 304 unique district-village pairs.
- Expected duplicated keys: Kecamatan Gedeg / Ngareskidul, Kecamatan Gondang / Kemasantani, Kecamatan Jetis / Mojorejo, Kecamatan Mojosari / Seduri.
- Exactly 230 positive T60 units.
- New weighted T60 sum within 0.000001 ha of 323.33406072288363 ha.
- Every one of the 304 area values within 0.000001 ha of the historical per-unit archive.

A total-area match without per-unit agreement is insufficient. The 230-positive test must be satisfied independently, including the smallest areas.

## Interpretation

A successful fresh run would verify that the **existing locked Stage 6 asset** reproduces the archived Stage 7 administrative statistics on the original grid. It would strengthen provenance and internal reproducibility but would not demonstrate independent Dynamic World Stage 1–3 classification or Stage 5 accuracy assessment.

References: Google Earth Engine `ee.Image.reduceRegions` API and weighted reducer guidance.
- https://developers.google.com/earth-engine/apidocs/ee-image-reduceregions
- https://developers.google.com/earth-engine/guides/reducers_weighting
