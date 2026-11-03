# Private staging upload status

Checked 3 November 2026.

## Confirmed in GitHub
- 17 Stage 7 low-memory district CSV files, sourced from the connected Google Drive folder `Mojokerto_Stage7_LowMemory`.
- 2 CSV files for the T50, T60 and T70 threshold analysis, sourced from the connected Google Drive folder `Mojokerto_Stage7_Reviewer`.
- Reconstructed GEE Stages 1 to 6 script.
- Stage 8 independent omission sampling design script. This is a design only, not a completed reference assessment.
- Stage 6 comparison and threshold economics Python scripts.
- BPS and boundary provenance notes, next-analysis notes, and archived Stage 6 quality-control summary.
- README, data-availability description, release checklist, and checks summary.

## Not yet transferred
- `Mojokerto_Stage7_LM_09_Kutorejo.csv`. The attempted GitHub upload was blocked by a safety check. The source remains in Google Drive.
- Other files from the prepared local candidate archive, including complete 304-unit derived tables, additional analytical scripts, and detailed validation files. Their absence should not be mistaken for verified reproducibility.

## Limitations
- The repository is private and does not meet the manuscript reviewer's request for a public archive.
- The Stage 1 to 6 Earth Engine script is a reconstruction. No live GEE rerun has established raster-level equivalence with the historical results.
- Stage 8 reference points are unlabelled and were not uploaded.
- Redistribution rights for administrative geometries, external reference imagery and some research-derived data still require verification.
- No DOI has been issued.
- The `CHECKS_SUMMARY.md` describes tests of the prepared archive and does not imply that all tested files are currently hosted in GitHub.

## Next checks
1. Review the missing Kutorejo source without bypassing the failed safety check.
2. Reconcile the combined 304-unit Stage 7 table against all 18 district exports and the archived Stage 6 reference.
3. Confirm appropriate permission and attribution before publication.
4. Verify the reconstructed GEE workflow against historical output where possible.
5. Keep the repository private until the public-release checklist is complete.
