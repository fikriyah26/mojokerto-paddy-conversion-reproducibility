# Stage 16: source, cartography, LP2B, and public-release audit

**Date:** 4 November 2026

**Status:** Manuscript source and cartographic edits completed. Spatial LP2B overlay **not executed**, since its geometric SHP component is not present in the Mojokerto Drive folder. GitHub repo visibility **still private** and must be changed by its owner using the GitHub Settings interface.

## Historical validation uncertainty

The 40 originally selected T60 candidate patches included 35 imagery-confirmed transitions and five unconfirmed transitions, which supports detected-patch precision of 87.5% for that selected sample. The study did not collect the requisite probability sample of unchanged land, so omission error, recall, overall accuracy and area-adjusted mapping uncertainty cannot be calculated. This is a declared study limitation; no additional approximately 800 land parcels must be manually inspected to preserve the original research scope.

## LP2B and spatial-planning source completeness

Google Drive source folder: https://drive.google.com/drive/folders/1dvxV-kCKSSdCGQ-Fj7DfZLFcE10l9uPF

- `rencana_pola_ruang.dbf`: 5,088 attribute records with 600 labeled `LP2B`, projection sidecar EPSG:4326, **missing matching .shp**. Without geometries, no legally or scientifically valid intersection is possible.
- A different `RENCANA_POLA_RUANG_AR.shp` source from another Drive folder contains 5,087 polygons at approximately 113.476 to 114.108 E and -2.404 to -1.585 S. This **does not intersect the Mojokerto study region** and is not a valid replacement for the missing geometry.
- Original locked T60 conversion raster has EPSG:3857 native 10 m grid; transformed bounds roughly 112.332 to 112.664 E and -7.779 to -7.303 S.

No LP2B conversion-area total, proportion, RTRW class allocation, compliance determination or parcel legality is reported until the correct .shp geometry and the plan version are verified.

## Figure QA and source provenance

- Figure 1: original administrative map preserved, 450 dpi.
- Figure 2: original 2018/2025 context imagery preserved, clarification added directing readers to the real 40-site map in Supplementary Figure S2. The three image close-ups are illustrations, not a substitute for the full validation geography.
- Figure 3: retained verified 230-unit scatterplot with named reference villages.
- Figure 4: re-rendered from independently reconciled historical LISA classifications, accessible palette with HH orange, LL blue, HL purple and LH green, hatched excluded units, northern orientation, scale and UTM grid. The figure depicts **nominal** unadjusted Local Moran significance rather than BH-confirmed clusters.
- Original Stage 15 40-point validation map preserved and inspected.
- Original author figures, restricted satellite sources and third-party planning geometries have not been added to GitHub.

Institutional source audit verified direct publication-page links for all 18 `Kecamatan Dalam Angka 2025` source publications. Official sources for 2025 paddy production, 2025 mill-level rice prices and 2023 regional-government reporting were inserted in the manuscript. The externally verified direct links are retained in the locally delivered Stage 16 CSV.

## Identity and access

The author explicitly confirms **no ORCID**. No ORCID number is claimed. ResearchGate is not an ORCID substitute, and no unverified ResearchGate URL has been added.

GitHub HEAD contained 98 files when examined, predominantly scripts, derived numerical CSV and documentation. No original SHP, TIFF, ZIP, DOCX or PNG assets are tracked in HEAD, but **historical commits, embedded document links, and source-license terms have not been comprehensively audited**.

The connected GitHub actions do not include changing repository visibility. The owner must use:
https://github.com/fikriyah26/mojokerto-paddy-conversion-reproducibility/settings
→ General → Danger Zone → Change repository visibility → Public → Confirm.
This affects the entire commit history. Verify permitted distribution and personal metadata before making the change. **Do not claim the repo is public until GitHub reports public visibility.**

## Reviewer audit and deliverables

Reviewer status for 67 items after document changes: 43 completed, 15 partially addressed, 0 outstanding and 9 requiring no change. These counts reflect the new source, cartographic and author-metadata revisions, without inventing a spatial overlay or omission estimate.

The updated anonymized manuscript rendered to 17 pages, its supplementary methods document to 8 pages, and the reviewer response document to 16 pages. Five original native Word math expressions, six main data tables and four figure objects remain. Main research results were not recalculated or altered.

Local user deliverables: two editable manuscript DOCX versions, supplementary DOCX, reviewer DOCX and CSV, new Figure 4 PNG and source classifications CSV, LP2B source QA CSV, 18-source BPS CSV, audit report and ZIP. These are conversation files, not claimed to be uploaded to GitHub.

**Required geometry for future overlap test:** the missing `rencana_pola_ruang.shp` matching the source 5,088-record `rencana_pola_ruang.dbf` and its .shx/.prj.
