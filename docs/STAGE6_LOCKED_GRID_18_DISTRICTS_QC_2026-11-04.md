# Complete 18-district historical Stage 6 grid-aligned verification

**Date:** 4 November 2026

## Evidence and provenance

All 18 GEE CSVs were fetched directly from the user's connected Google Drive folder: https://drive.google.com/drive/folders/1i60YJHaWVNFUIWUi_FEa4cX0uObQB6Z9

The exact links for each original CSV and its numerical summary are preserved in `qa_outputs/Mojokerto_Stage6_GridQC_18_District_Summary_2026-11-04.csv`. The original CSVs remain in Google Drive, not mirrored in this repository.

Sources:
- Original legacy Stage 3: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`, `conv_T60`
- Original legacy Stage 6 locked: `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1`, `final_conv`
- Grid: `EPSG:3857`, transform `[10, 0, 12504720, 0, -10, -815190]`
- Stage 3 candidate forced onto locked grid **before** a 5-pixel eight-connected patch filter, max connected count 1024
- GEE script: `gee/06_stage6_locked_grid_18_district_BATCH.js`
- GEE reduction: `ee.Reducer.sum().unweighted()` at the locked grid, evaluated per district

## Results

| Measure | Historical locked Stage 6 | Reconstructed from Stage 3 |
| --- | ---: | ---: |
| Districts with completed CSVs | 18 of 18 | 18 of 18 |
| Source administrative polygon parts | 308 | 308 |
| Positive pixel centres within district polygons | 33113 | 33113 |
| Sum of pixel-centre geodesic area | 323.3343551699072 ha | 323.3343551699072 ha |
| Mismatched pixel centres | 0 | 0 |
| Locked-only positive pixel centres | 0 | Not applicable |
| Reconstructed-only positive pixel centres | Not applicable | 0 |
| Mismatch area | 0 ha | 0 ha |

Every one of the 18 districts reports zero mismatch pixels and zero one-sided positive pixels. All 18 rows have matching input asset IDs, EPSG:3857 affine grid, minimum patch length 5 and eight-connected component rules.

**This is a successful within-boundary pixel-centre comparison** between the original locked Stage 6 IMAGE and a rebuilt mask from the historical Stage 3 IMAGE on the locked grid.

## Separate archived area-weighted statistics

The archived `data_derived/Stage7_304_Units_From_18_District_Exports.csv` was independently read and checked:

- 304 distinct administrative units across 18 districts.
- 230 units with strictly positive `area_T60_ha`.
- Sum of village weighted areas: **323.3340607228835 ha** (rounding of the archived reference **323.33406072288363 ha**).

The pixel-centre total differs from the archived area-weighted total by approximately **+0.0002944470 ha**, because the reducers have different rules for treating pixels intersected by boundaries. These two values must not be substituted for each other.

The preserved final GeoTIFF independently contains 33,126 positive pixels in its complete extent, 33,113 of whose centres are within administrative units, as documented in `docs/STAGE6_LOCKED_RASTER_OFFLINE_AUDIT_2026-11-04.md`.

## Methodological interpretation

A previous batch reconstructed Stage 6 directly from Stage 3 with an EPSG:32749 at 10 m reduction and obtained **323.5819606929078 ha**, exceeding the archived Stage 6 reference by **0.2478999700241502 ha**.

Once the candidate was aligned to the locked Stage 6 EPSG:3857 grid **before filtering**, its pixels matched the locked image throughout the 18 district test geometries. This confirms that grid-aligned reconstruction is successful within the tested geographic domain and provides strong evidence that spatial grid handling is relevant to the previous discrepancy. It does not isolate the precise contribution of resampling versus subsequent zonal reduction, since multiple operations differed between the workflows.

## Scope limits and outstanding work

1. Pixel-centre comparison does not evaluate the 13 positive GeoTIFF pixels outside administrative polygon centres, nor classify all pixels outside the study boundary.
2. Archived 304-unit and 230-positive-unit totals have been reconciled from historical exports. An independent fresh GEE run of weighted 304-unit statistics would be a separate verification.
3. Stage 1 to Stage 3 classification from Dynamic World and Stage 5 independent validation were not re-executed. The recovered source code remains reconstructed rather than a verbatim historical source.

**Stage 6 raster agreement on the tested 18-district domain: PASS.**

**Historical 304-unit area totals from archived exports: PASS (archive reconciliation).**

**Complete end-to-end historical source reproduction: NOT YET VERIFIED.**
