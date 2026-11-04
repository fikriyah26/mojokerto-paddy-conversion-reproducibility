# Locked-grid Stage 6 verification, Kecamatan Kutorejo

**Evidence date:** 4 November 2026

## Source evidence

- User-provided GEE Console reports the locked image `projects/earthengine-legacy/assets/users/fikriiyah26/Mojokerto_FINAL_LOCKED_T60_ge5px_v1` with band `final_conv` and EPSG:3857 grid `[10,0,12504720,0,-10,-815190]`.
- Original Stage 3 image: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`, band `conv_T60`.
- Completed CSV: https://drive.google.com/file/d/14vCd_eG-DiM-wT8q26W2EnpVHKmiOX5G/view
- Unchanged evidence CSV in this repository: `qa_outputs/Mojokerto_Stage6_Grid_QC_Kutorejo_2026-11-04.csv`
- Experimental workflow: `gee/05_stage6_locked_grid_district_BATCH.js`

## Recorded results

| Field | GEE batch result |
| --- | ---: |
| District | Kecamatan Kutorejo |
| `locked_pixels` | 2830 |
| `rebuilt_pixels` | 2830 |
| `mismatch_pixels` | 0 |
| `locked_only_ha` | 0 |
| `rebuilt_only_ha` | 0 |
| `mismatch_ha` | 0 |
| `locked_ha` | 27.630283154547215 |
| `rebuilt_ha` | 27.630283154547215 |
| Locked grid CRS | EPSG:3857 |
| Locked grid affine | [10,0,12504720,0,-10,-815190] |

The zero mismatch count confirms agreement between the historical locked raster and the Stage 3 derived five-pixel eight-connected reconstruction at every evaluated pixel centre inside Kecamatan Kutorejo. The pixel-centre area is also consistent with the archived offline TIFF audit (27.630283184373937 ha), differing by approximately 0.000000029827 ha due to the numeric area implementation.

## Implications

A previous GEE batch with an EPSG:32749 at 10 m reduction produced 323.5819606929078 ha for the reconstructed Stage 6 at the regency level, 0.2478999700241502 ha above the historical locked total of 323.33406072288363 ha.

This Kutorejo test establishes that the Stage 3 derived filter can reproduce the locked raster exactly **within one district** when the source candidate image is aligned to the locked EPSG:3857 pixel grid before connected component filtering.

The test strengthens the grid-dependence hypothesis. It is **not** yet evidence that the same result holds for all 18 districts or that the full historical processing source has been recovered.

## Next step

Run `gee/06_stage6_locked_grid_18_district_BATCH.js` in six runs by setting `BATCH_START` successively to 0, 3, 6, 9, 12 and 15 with `BATCH_COUNT = 3`. Each run creates up to three CSV export tasks in the private `Mojokerto_GEE_Research` Drive folder.

After all 18 outputs are complete, verify that each district reports zero mismatch, zero locked-only and rebuilt-only pixel centres, and equal locked and rebuilt area. The checks should also evaluate 304 distinct administrative units and the 230 positive units as a subsequent step. Preserve all original raster assets.
