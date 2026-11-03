# Public release checklist — author verification required

## Mandatory before setting GitHub visibility to Public

- [ ] Confirm legal rights to publish the author-created JavaScript, Python scripts, and research-derived CSVs.
- [ ] Check whether historical image interpretation records, including point coordinates, may be distributed. If not, remove `data_reference/Mojokerto_Stage5_QA60_Points_revised.csv` before publication, retaining non-georeferenced aggregated QA summaries.
- [ ] Check that Stage 6 and Stage 7 derived tables do not contain restricted third-party fields or confidential records.
- [ ] Choose explicit license terms for code and datasets, if rights permit. Otherwise publish with clear limited access and no blanket license.
- [ ] Scan all files for access tokens, account IDs, confidential paths, personally identifying data, and hidden external credentials.
- [ ] Verify documented data attribution and distinguish the reconstructed workflow from the historically executed code.
- [ ] Verify dependencies and tests in the target environment.
- [ ] Create a new GitHub repository and upload the reviewed files. Make the repository Public only after the checks above are complete.
- [ ] Archive a tagged GitHub release with Zenodo if a citable DOI is needed. Check the final deposition and DOI URL.
- [ ] Update the manuscript Data Availability Statement with the **actual** permanent repository URL and DOI. Do not invent an identifier.

## Not completed by this preparation

Earth Engine account-specific asset IDs and access permissions, full Stage 1–6 rerun, pixel-level historical output equivalence, independent area-weighted omission assessment, redistribution permission for third-party administrative geometries, and live public publication.