# Mojokerto paddy-field conversion: research reproducibility archive

**Release status:** private staging repository. Public release and external reproduction are not yet verified. These files document a study of potential paddy-to-built-up conversion, foregone annual rice-production capacity, and exploratory spatial screening in Mojokerto Regency, Indonesia.

**Repository upload status (3 November 2026): PARTIAL.** Seventeen of the eighteen Stage 7 district CSV files from connected Google Drive, two reviewer threshold CSVs, and selected analysis scripts and provenance documents are present. The Kutorejo district CSV could not be transferred because the upload action was blocked by a safety check. The remaining files described below are part of the prepared local research archive and are not necessarily present in GitHub. Consult `UPLOAD_STATUS.md` and the actual GitHub file tree before assuming any file is available. No public release or complete reproducibility is claimed.

## Evidence and scope

The main T60 archival calculation reports approximately 323.3341 ha of mapped potential conversion in 230 of 304 villages and urban villages, corresponding to an estimated 1,628.68 tonnes of foregone annual rice-production capacity under the paper's fixed parameters. These are modeled capacity equivalents, not observed cumulative production losses or area-adjusted change estimates.

This repository draws on archived analytical outputs. The Google Earth Engine Stage 1–6 JavaScript is a **reconstruction** of the documented historical processing decisions, **not** the original executable file confirmed to reproduce the exact historical pixels. No independent Earth Engine rerun has been carried out in preparing this candidate release. Archived Stage 7 tables have been reconciled with the locked Stage 6 T60 figures, which is an archival numerical consistency check, not a full reproduction of the raster workflow.

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