# Mojokerto paddy-field conversion: research reproducibility archive

**Release status:** private staging repository. Public release and external reproduction are not yet verified. These files document a study of potential paddy-to-built-up conversion, foregone annual rice-production capacity, and exploratory spatial screening in Mojokerto Regency, Indonesia.

**Repository upload status (updated 4 November 2026):** All 18 district CSVs have been transferred from Google Drive and aggregated into 304 unique administrative units. The T60 aggregate matches the archived historical area to floating-point precision. A separate reviewer-folder export remains inconsistent and is retained for provenance, not treated as the principal estimate. Some secondary analytical archive files have not yet been uploaded. See `UPLOAD_STATUS.md` and `docs/STAGE7_DISTRICT_RECONCILIATION.md`. This repository remains Private. Original-raster Stage 7 T60 outputs have now been freshly reproduced in GEE, but a complete end-to-end Stage 1–6 classification and validation rerun is still unverified.

## Evidence and scope

The main T60 archival calculation reports approximately 323.3341 ha of mapped potential conversion in 230 of 304 villages and urban villages, corresponding to an estimated 1,628.68 tonnes of foregone annual rice-production capacity under the paper's fixed parameters. These are modeled capacity equivalents, not observed cumulative production losses or area-adjusted change estimates.

This repository draws on archived analytical outputs. The Google Earth Engine Stage 1–6 JavaScript is a **reconstruction** of the documented historical processing decisions, **not** the original executable file confirmed to reproduce the exact historical pixels. Authenticated Earth Engine checks performed by the author on 4 November 2026 successfully reconstructed the locked Stage 6 T60 mask from the original Stage 3 asset on its historical EPSG:3857 grid, with zero mismatched positive pixel centres across all 18 district test geometries. These checks do not reconstruct the full original Dynamic World Stage 1–3 classification or Stage 5 validation. Archived Stage 7 tables have separately been reconciled to the locked Stage 6 T60 area and 230 positive administrative units.

**Live historical Stage 6 raster QC:** 18 of 18 districts show no pixel-centre differences between the original locked Stage 6 image and a Stage 3 T60 five-pixel filtered reconstruction aligned to the original raster grid. See [18-district QC report](docs/STAGE6_LOCKED_GRID_18_DISTRICTS_QC_2026-11-04.md) and [summary table](qa_outputs/Mojokerto_Stage6_GridQC_18_District_Summary_2026-11-04.csv). This is not an end-to-end reproduction of the entire historical processing chain.

**Fresh Stage 7 T60 administrative-area verification, 4 November 2026:** All 18 district exports from the preserved, original locked Stage 6 GEE IMAGE have been reproduced using the corrected native-grid weighted reducer. The 308 source polygon parts merge to 304 unique administrative units, **all 304 unit areas agree** with the historical T60 archive within 0.000001 ha, **230 positive units** match, and the total is **323.3340607228835 ha**, consistent with the historical locked 323.33406072288363 ha. See the [full original-raster-to-Stage-7 PASS report](docs/STAGE7_304_VILLAGES_FRESH_GEE_WEIGHTED_PASS_2026-11-04.md). This result does not demonstrate an independent end-to-end rerun of Stage 1–3 classification or Stage 5 validation.

**Fresh Stage 8 T50 and T70 sensitivity verification, 4 November 2026:** The author completed all 18 GEE threshold exports on the verified locked Stage 6 grid. All 304 administrative unit areas match the archived T50, T60 and T70 values within 0.000001 ha each. The respective positive-unit counts are **261, 230 and 128**, and the fresh weighted totals are **610.9156962921805 ha**, **323.33406086654634 ha** and **89.02844375957753 ha**. The independently reconstructed T60 and the original locked T60 agree for all 304 units. See [full Stage 8 PASS report](docs/STAGE8_T50_T70_304_VILLAGES_FRESH_GEE_PASS_2026-11-04.md). This does not establish pixel identity to separately preserved final T50/T70 rasters or independently reproduce the upstream classification and validation steps.

**Fresh Stage 9 rice-capacity and gross-output verification, 4 November 2026:** Independently recalculated 304-unit annual harvested-area, GKG, food-rice capacity and gross-output estimates for T50, T60 and T70 using the verified fresh Stage 8 areas. The observed outputs match the archived sensitivities within 0.00001 tonnes/year and IDR 100/year, with approximately **3,144.45 / 1,628.68 / 429.83 tonnes of food rice per year** and **IDR 40.830 / 21.148 / 5.581 billion of gross annual rice output**. The 31 extra T50-positive villages use explicitly identified provisional cropping-intensity coefficients from 2024 BPS village data, while 230 T60 coefficients are copied from the archived study model. Results are conditional on the archived production ratios and manuscript-stated full-precision 2025 medium-rice mill price. See the [Stage 9 economic verification report](docs/STAGE9_RICE_CAPACITY_AND_GROSS_OUTPUT_FRESH_GEE_VERIFICATION_2026-11-04.md) and [runnable calculator](tools/verify_stage9_rice_economics.py). Upstream map validation, national price microdata recovery, causal inference and spatial tests remain outside this verification.

## Reproducibility files

- `gee/`: reconstructed Stage 1–6 code and separately identified Stage 7 / independent sampling additions.
- `data_reference/Stage6_archived_304_units.csv`: historical derived unit-level table, without administrative geometries.
- `data_reference/Mojokerto_Stage5_QA60_Points_revised.csv`: selected candidate-patch interpretation records. This sample supports detected-patch precision only, not omission error or area-adjusted accuracy.
- `data_derived/`: Stage 7 threshold outputs and additional village-level research results. Check each file's data lineage before any inferential reuse.
- `qa_outputs/`: archived quality-control records and validation summaries.
- `tools/` and `tests/`: scripts for local checks and analyses, with documented limitations.
- `docs/`: provenance, required datasets, Earth Engine execution status, and research limitations.

## Using the code

1. Obtain a working Earth Engine account and a **lawfully accessible** version of the study's harmonized administrative geometry with 304 units, including `KECAMATAN` and `DESAKEL` fields.
2. Set the administrative asset ID or import the collection as `table` in the GEE Code Editor. The example identifiers in `gee/Mojokerto_GEE_Stages_1_to_6.js` are placeholders. Do not overwrite the locked historical assets.
3. Execute each reconstructed stage sequentially, review Tasks, and compare newly produced outputs against the historic records in `docs/OUTPUTS_AND_CHECKS.md`.
4. Do not claim exact reproduction unless the actual assets, annual masks, and outputs have been independently checked at appropriate spatial resolution.
5. The 60 selected candidates do not form an independent probability sample of mapped unchanged areas, so omission error, recall, design-based overall accuracy, and area-adjusted conversion confidence intervals are unavailable from these records alone.

## Source attribution

Dynamic World V1 is created for the Dynamic World Project by Google in partnership with the National Geographic Society and World Resources Institute. Its terms are CC BY 4.0: https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1

The underlying official agricultural statistics belong to their issuing institutions. Derived transcriptions are annotated with their sources in the accompanying provenance documentation. Neither third-party administrative geometries nor historical imagery is bundled with this candidate release.

## Release and license status

**Do not publish this candidate without the checks in `RELEASE_CHECKLIST.md`.** No code or data license has yet been selected. The repository's source code and research-derived files should be licensed intentionally only after the author confirms ownership and third-party reuse constraints. Publishing a repository without a license does not automatically grant permission for reuse.

## Research manuscript

*Foregone Annual Rice Production Capacity and Gross Output Value Associated with Paddy-Field Conversion: Spatial Patterns in Mojokerto Regency, Indonesia*. Manuscript 805005, under revision for JESSD. Do not cite this private staging repository as publicly accessible or add a DOI to the manuscript before a verified public release.