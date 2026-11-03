# Stage 7 district export reconciliation

Checked 3 November 2026 from the connected Google Drive folder `Mojokerto_Stage7_LowMemory`.

## Method

Read all 18 original district CSV files. All contained the expected five fields: `KECAMATAN`, `DESAKEL`, `area_T50_ha`, `area_T60_ha` and `area_T70_ha`. Every conversion-area entry was numeric and nonnegative.

The input contains 308 polygon-part rows. Grouping on district and village name, with summation of multipart areas, results in 304 distinct village and urban-village units. The multipart keys are Mojosari / Seduri, Jetis / Mojorejo, Gondang / Kemasantani and Gedeg / Ngareskidul.

## Reconciled results

| Measure | T50 | T60 | T70 |
| --- | ---: | ---: | ---: |
| Area, hectares | 610.9156963323798 | 323.3340607228837 | 89.0284436968486 |
| Units with positive mapped conversion | 261 | 230 | 128 |

The main T60 value is consistent with the locked historical study summary of 323.33406072288363 hectares to ordinary floating-point tolerance. This reconciliation validates numerical aggregation only. It is not a rerun of satellite classification, a map-accuracy assessment, or evidence of an area-adjusted estimate.

## Important discrepancy with the reviewer folder

The independent Google Drive folder `Mojokerto_Stage7_Reviewer` contains `Mojokerto_Stage7_POSTPATCH_Totals.csv`, reporting T50 = 610.40558968762 ha, T60 = 323.5819606944334 ha and T70 = 89.29731210208661 ha. Those totals differ from the locked historical Stage 6 / 18-district output.

A comparison of the corresponding by-village reviewer table against grouped district records found differences greater than 1e-9 hectares for 262 of the 304 administrative units. Accordingly, these reviewer-folder exports must **not** be silently substituted for the principal T60 results.

The derivation and execution history of the reviewer-folder export remains to be checked before assigning its discrepancies to a specific processing cause.

## Data lineage

- Input: 18 district CSVs in `data_drive/stage7_lowmemory` from Google Drive
- Derived output: `data_derived/Stage7_304_Units_From_18_District_Exports.csv`
- Reference check: historical T60 area summarized in manuscript and archived Stage 6 audit
- Comparison sources: two original reviewer-folder CSVs in `data_drive/stage7_reviewer`

All original inputs have been retained unchanged.
