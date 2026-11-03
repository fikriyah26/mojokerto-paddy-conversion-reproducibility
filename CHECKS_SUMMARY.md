# Candidate release quality checks

Last checked: 3 November 2026.

- The archived Stage 6 village summary contains 304 records.
- The archived Stage 7 final village CSV contains 304 records.
- The selected candidate-patch QA reference contains 60 records.
- Three local Python unit tests passed using synthetic validation cases. These tests do not validate the mapping accuracy or the historical Earth Engine execution.
- The three JavaScript Earth Engine files passed `node --check` syntax validation. This does **not** imply that they execute successfully in Earth Engine or reproduce the original historical rasters.
- No credentials matching common private-key, GitHub token, Google API key, or AWS key patterns were detected in the candidate files. This is not a comprehensive secrets audit.
- No `.shp`, `.dbf`, `.gpkg`, `.tif`, `.tiff`, or source administrative ZIP files are included in this release candidate.
- The candidate is staged in a **private** GitHub repository and has no public DOI. The rights, licensing, and code-execution gates remain open.