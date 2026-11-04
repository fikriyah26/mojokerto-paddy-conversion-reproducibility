# Stage 15 methods compression, Stage 5 validation coordinates, and final reviewer audit

**Audit date: 4 November 2026.** The revised anonymized manuscript 805005, associated author master, Supplementary Methods, and 67-item reviewer matrix were generated as conversation deliverables. The original files in Google Drive and the source Stage 14 document were not overwritten.

## Corrected archival discovery

The prior Stage 14 audit stated that the historical 40-patch validation point coordinates could not be located in the current GitHub source inventory. **That statement is superseded.** A separate author-held historical source archive named `Mojokerto_GEE_GitHub_Plus_Analisis_Omission_Threshold.zip` contains `data_reference/Mojokerto_Stage5_QA60_Points_revised.csv`, an original semicolon-delimited table with 60 verified WGS84 patch-centroid coordinates, group membership, classification results and archived reference-image month fields.

- Group A: 20 T70-robust candidate patches, 18 confirmed
- Group B: 20 additional T60-robust candidate patches, 17 confirmed
- Group C: 10 small T60 candidate patches, 7 confirmed
- Group D: 10 T50-only candidate patches, 5 confirmed

The principal T60 reference sample therefore remains **35 confirmed of 40** detected candidate patches, or **87.5% observed patch precision**. The original 60 point centroids were all spatially matched to exactly one of the original 304 administrative polygons of Kabupaten Mojokerto. The revised Supplementary Figure S2 depicts the **40 genuine primary centroids** on two uncluttered 20-point maps, with status colors, coordinate grid, 5 km scale and north arrow. Source patch identifiers remain available in a separate exact 40-row audit CSV. This is NOT the same map as the 12 villages selected for exploratory LISA screening.

This source discovery **does not add a probability-based unchanged reference sample**, so omission error, recall, overall accuracy and an area-adjusted conversion-area confidence interval remain unavailable. The map must not be used to imply those estimates.

## Methods and supplementary document

Methods paragraph word count reduced from **3,877 to 1,896 words**, a reduction of **1,981 words**, approximately **51.10%**. Five native Word equations, six primary data tables and the original four images remain structurally intact. Original data tables, equation XML, and image media were checked to be identical to their Stage 14 sources.

The new supplementary document provides:

- **Figure S1** six-stage conceptual accounting flow, with a supporting editable Word table
- **Figure S2** actual principal 40 validation candidate centroids, split by groups A and B
- Dynamic World temporal screening settings and the native locked grid
- Original four-group validation table and accuracy-sampling limitations
- Cropping-intensity quality screening, undefined ratios, district-median imputations, upper cap and four main sensitivity treatments
- Source filenames, BPS publication tables and page references for all 18 kecamatan
- Complete typology sensitivity table for 40th, 50th, 60th and 75th percentiles
- Global Moran weight sensitivity and nominal Local Moran p-value tiers, separately from BH-adjusted significance

The original 230-unit typology group counts A, B, C, D are **54, 61, 61, 54** at the median split. The number of Type A units is **82, 54, 36 and 16** under 40th, 50th, 60th and 75th percentile cutoffs. Archived local p-value tiers at thresholds 0.05, 0.01 and 0.001 were recalculated and retained, with strict versus non-strict p=0.05 distinctions.

## Reviewer matrix

The original 67 comment texts were retained verbatim. Before Stage 15 the review had 37 complete, 20 partial, 1 outstanding and 9 no-change-needed comments. The new verified matrix has **40 complete, 18 partial, zero outstanding and 9 no-change-needed** comments.

The three newly fully addressed items were:

- **Item 25:** conceptual workflow diagram (Supplementary Figure S1)
- **Item 58:** existing Figure 2 close-ups plus actual 40-location map (Supplementary Figure S2)
- **Item 65:** substantive Methods compression with detailed cropping-index cleaning moved into the supplementary document

All other 18 partly completed comments were retained honestly as partial, with the remaining data gaps individually documented. High-priority gaps include absent stratified probability controls for area-adjusted accuracy, official LP2B/RTRW and infrastructure spatial overlays, public archival code/data availability subject to licenses, complete public-source bibliographic links and author ORCID confirmation.

The discussion additionally contextualizes 323.33 ha as approximately 1.26% of the study-defined 25,694.64-ha agricultural baseline, and notes that 53.89 ha per year from a nominal six-year divisor is only an arithmetic comparison, NOT an observed annual land-conversion rate.

## QA

- Anonymized manuscript rendered to **17 pages**
- Author master rendered to **17 pages**
- Supplementary Methods rendered to **6 pages**
- Reviewer matrix rendered to **16 pages**
- Six manuscript tables unchanged in cell values
- Five native Word math equation objects unchanged in XML
- Four originally embedded manuscript figure media unchanged in file SHA-256
- Author email and personal identifiers not found in tested anonymized DOCX XML fields
- No fictional source p-values, site coordinates, article DOI, or public GitHub release claim

The local Stage 15 deliverables are preserved in the conversation ZIP `Mojokerto_Stage15_Metode_Lampiran_Reviewer.zip` (12 files). Only this evidence report is written to GitHub. Original private geometry is not republished.
