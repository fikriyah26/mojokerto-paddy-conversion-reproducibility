# Stage 6 and Stage 7 derived-table consistency check

Checked locally on 3 November 2026 against the prepared research archive, before public release.

The file `data_derived/Stage7_FINAL_304_Desa.csv` in the prepared local candidate archive contains 304 records. For each village, its archived Stage 6 T60 area is compared with the Stage 7 district-aggregation value. The largest absolute village-level difference is approximately 5.02e-13 ha.

| Derived quantity | T50 | T60 | T70 |
| --- | ---: | ---: | ---: |
| Potential converted area (ha) | 610.9156963323796 | 323.3340607228837 | 89.02844369684856 |
| Estimated foregone annual rice-production capacity (tonnes/year) | 3144.451679092195 | 1628.6782775339984 | 429.8339091474901 |
| Estimated annual gross rice-output equivalent (IDR) | 40830353158.2001 | 21148205168.794533 | 5581345207.673375 |

These are deterministic outputs under the manuscript's stated cropping-intensity, yield, grain-to-rice and milling-price parameters. The comparison does not independently validate pixel classification, historical conversion timing, omission error or monetary uncertainty. In particular, the year-specific output equivalents are not observed cumulative losses.

The prepared enriched Stage 7 table is **not** claimed as uploaded in GitHub by this note. The already published private-repository table, `data_derived/Stage7_304_Units_From_18_District_Exports.csv`, contains verified T50/T60/T70 area values aggregated directly from the 18 CSVs on Google Drive.

The reviewer-folder export discrepancy described in `docs/STAGE7_DISTRICT_RECONCILIATION.md` remains unresolved. Do not silently replace the reconciled historical T60 results with reviewer-folder totals.
