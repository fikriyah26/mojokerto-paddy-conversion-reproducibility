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
2. The configured Stage 3 path, `users/fikriyah26/Mojokerto_Stage3_ConversionMask`, is not proof that an accessible asset exists. Verify the actual asset ID in the GEE Assets panel.
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
