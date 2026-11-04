# Stage 6 T60 batch QC, author-run Earth Engine

**Verified on:** 4 November 2026

## Evidence

- Drive source file: https://drive.google.com/file/d/1InEklIFxqZWSWWaJMgkfCV1fST0PKGYH/view
- CSV name: `Mojokerto_Stage6_T60_Batch_QC_Patch5.csv`
- Source CSV stored unchanged in private repository: `qa_outputs/Mojokerto_Stage6_T60_Batch_QC_Patch5_2026-11-04.csv`
- Historical input asset: `users/fikriiyah26/Mojokerto_Stage3_ConversionMask`

## Observed result

| Parameter | Recorded value |
| --- | ---: |
| T60 area before connected-patch filter | 332.3841543521086 ha |
| Area removed by the filter | 8.802193659200839 ha |
| T60 area after five-pixel filter | 323.5819606929078 ha |
| Locked historical Stage 6 T60 area | 323.33406072288363 ha |
| Excess of reconstructed over historical | 0.2478999700241502 ha |
| Relative difference from historical | 0.07666992134076933% |
| Threshold connected max size | 1024 pixels |
| Eight-connected component rule | yes |
| Minimum retained patch | 5 pixels |
| Area reducer grid | EPSG:32749 at 10 metres |
| Stage 3 native CRS | EPSG:4326 |
| Source polygon parts | 308 |
| Target distinct administrative units | 304 |

**Key comparison:** `Mojokerto_Stage7_POSTPATCH_Totals.csv`, from the separate reviewer-folder run, reports T60 = 323.5819606944334 ha. Difference against this author-run batch = 0.00000000152562 ha, consistent to floating-point precision. The batch therefore reproduces the previously flagged reviewer-folder result, **not** the locked Stage 6 result.

## Evidence of historical locked raster

The connected Google Drive folder `Mojokerto_Manuscript_Figures` contains `Mojokerto_Final_Conversion_Mask_Locked.tif` (https://drive.google.com/file/d/1zzkj1MFlr_T9zYB1f7SCneXJNyKg_W74/view). Earlier independent local-raster audit recorded that file as a one-band binary raster with a native EPSG:3857 grid, distinct from the Stage 3 raster's EPSG:4326 grid. A historical GeoTIFF rasterization check found approximately 323.334355 ha within the 304 administrative polygons by pixel-centre allocation, close to the archived Stage 6 area. That is a separate, approximate grid-based check, not a new Earth Engine result.

## Interpretation

- The reconstructed `Stage 3 -> connectedPixelCount >= 5 -> Stage 6` pipeline has been executed successfully by the author via batch export.
- The reconstructed pipeline's **area does not reproduce** the historical locked Stage 6 total.
- The projection and grid differences are possible contributors, but **no single cause has been proven**. Source masks, component connectivity under reprojection, area aggregation grid and boundary intersections may all require checking.
- Do **not** alter the historical manuscript estimate of 323.33406072288363 ha solely to match the new reconstructed output.
- Do **not** claim the manuscript's archived Stage 6 raster was reproduced pixel-for-pixel.
- The measured candidate-filter removal was **8.802193659200839 ha** under the reconstructed pipeline, not the roughly 9.05009 ha difference between candidate area and historical locked output.

## Recommended next test

1. Locate the actual historical locked Stage 6 IMAGE asset if it exists in the original Earth Engine legacy account, or ingest the archived locked GeoTIFF into a separate, new, read-only comparison image asset without overwriting source.
2. Read its band names, exact `projection()` and `projection().transform()`, not just its nominal scale.
3. Evaluate Stage 3 T60 patch filtering on the **locked raster's exact grid**, then reduce pixelwise disagreement and area difference in bounded spatial partitions where necessary.
4. Compare resulting administrative 304-unit totals and 230 positive units against locked Stage 6 records.
5. Document any source change or reprojection difference. Retain all original observations.

**Status:** Live numerical reproduction of the current reconstructed filtering pipeline: PASS. Reproduction of locked historical Stage 6: FAIL (difference 0.24789997 ha), pending investigation.
