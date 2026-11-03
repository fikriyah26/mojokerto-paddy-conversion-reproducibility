# Private staging upload status

Checked 3 November 2026, after the Kutorejo retry and Stage 7 reconciliation.

## Confirmed in GitHub
- All **18 of 18** original Stage 7 low-memory district CSV files, sourced from connected Google Drive.
- A grouped 304-unit Stage 7 output in `data_derived/Stage7_304_Units_From_18_District_Exports.csv`.
- Two original reviewer threshold CSVs (T50, T60 and T70), kept as separate comparison evidence.
- A reconciliation audit at `docs/STAGE7_DISTRICT_RECONCILIATION.md`, which documents significant disagreement with the reviewer-folder export.
- Reconstructed GEE Stages 1 to 6 script.
- Stage 8 independent omission sampling design script, **not** a completed validation assessment.
- Stage 6 comparison and threshold economics Python scripts.
- BPS and boundary provenance notes, next-analysis notes, and archived Stage 6 quality-control summary.
- Repository README, data-availability description, release checklist, and checks summary.

## Reconciled Stage 7
The 18 district CSVs contain 308 polygon-part rows which aggregate to 304 unique village/urban-village units. T50 = 610.9156963323798 ha, T60 = 323.3340607228837 ha, T70 = 89.0284436968486 ha. There are 261, 230 and 128 positive-conversion units respectively.

The historical T60 area matches the archived Stage 6 summary to floating-point tolerance. **This is numerical reconciliation, not independent satellite mapping validation.**

## Remaining release work
- The reviewer-folder threshold output differs numerically from the 18-district historical outputs. Its processing provenance remains unresolved and must not be silently substituted.
- Some local candidate archive files, including detailed validation and additional scripts, are not yet present in GitHub.
- Earth Engine Stages 1 to 6 are reconstructed and have not been rerun to demonstrate raster-level equivalence.
- Verify author-created code rights, data-redistribution permissions and appropriate licenses before setting the repository to Public.
- No DOI has been issued. Do not cite this private staging repository as public data availability.
- Stage 8 points are unlabelled and are not valid omission-error results.

The repository remains **Private** until these checks are addressed.
