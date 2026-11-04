# Stage 9 rice-production capacity and gross-output verification

**Status: PASS for numerical reproduction conditional on archived model inputs**

**Audit date:** 4 November 2026

## Scope and source provenance

The original source inputs were inspected directly in the author's Library workbook `Mojokerto_Foregone_Rice_Production_Sensitivity.xlsx`, particularly tabs `All_304_Villages`, `Model_230_Conversion`, `Model_Inputs_Final`, `Foregone_Desa`, `Sensitivity_Assumptions`, and `Sensitivity_Desa`.

The calculated physical conversion areas were taken from fresh, author-run GEE Stage 8 results:
`qa_outputs/Mojokerto_Stage8_ThresholdGrid_304_Unit_Comparison_2026-11-04.csv`, not silently substituted with the historical area reference.

The previously established historical numerical benchmarks are documented in
`docs/STAGE6_STAGE7_ECONOMIC_CROSSCHECK.md` and the most recent manuscript
`805005_Fikriyah_Revisi_Stage7_Sensitivitas_Spasial_Final_Biru.docx`.

New reproducibility artifacts in the private repository:

- `data_derived/Stage9_Rice_Coefficients_304_Units_2026-11-04.csv`: 304 village coefficients, status, BPS source publication and the unmodified raw cropping-intensity column.
- `qa_outputs/Mojokerto_Stage9_FreshGEE_304_Unit_Rice_Economics_2026-11-04.csv`: independently calculated physical conversion, annual harvested-area capacity, GKG, rice, and gross-output value per village and threshold.
- `qa_outputs/Mojokerto_Stage9_Rice_Economics_Summary_2026-11-04.csv`: three-threshold totals and residuals versus historical outputs.
- `tools/verify_stage9_rice_economics.py`: runnable Python standard-library recomputation that reads the two derived input CSVs and checks all registered thresholds.

## Registered model inputs

| Quantity | Value | Status |
| --- | ---: | --- |
| BPS study-model paddy harvested area, 2025 | 51,750 ha | Archived workbook input |
| BPS study-model GKG production, 2025 | 312,410 t | Archived workbook input |
| BPS study-model food rice production, 2025 | 180,390 t | Archived workbook input |
| Yield | 6.036908212560387 t GKG per harvested ha | Calculated ratio |
| Effective GKG to food-rice conversion | 0.5774142953170514 | Calculated ratio |
| Medium rice milling-level price, 2025 | IDR 12,984.88809 per kg | Full-precision value stated in the manuscript |
| Cropping intensity observations | 2024 village data | Archived workbook input and BPS district publications |
| Crop loss area | Fresh Stage 8 weighted area by village | Reprocessed from original GEE Stage 3 and Stage 6 data |

Annual foregone harvested area per unit equals mapped conversion hectares multiplied by the village cropping-intensity coefficient. Annual foregone GKG equals harvested-area capacity times model GKG yield. Foregone food rice equals GKG capacity times the effective GKG-to-food-rice factor. Gross output equals rice tonnes times 1,000 kg/tonne times the price per kg.

**The 87.5 percent Stage 5 detected-patch precision is NOT used as a correction factor**, and the model does not claim observed cumulative rice loss, farmers' net income or a causal area-adjusted classification estimate.

## Results from independently recalculated Stage 8 areas

| Metric | T50 | T60 | T70 |
| --- | ---: | ---: | ---: |
| Fresh physical conversion (ha) | 610.9156962921805 | 323.33406086654634 | 89.02844375957753 |
| Foregone harvested-area capacity (ha/y) | 902.0753611973963 | 467.2326676841297 | 123.3100771644882 |
| Foregone GKG capacity (t/y) | 5445.746156360945 | 2820.64072871882 | 744.411617525754 |
| Foregone food-rice capacity (t/y) | 3144.451679350694 | 1628.678278715752 | 429.8339095594595 |
| Gross rice-output value (IDR/y) | 40830353160.78133 | 21148205183.73786 | 5581345212.916761 |
| Positive units | 261 | 230 | 128 |

Historical benchmark capacities were T50 = 3144.451679092195 t/y, T60 = 1628.6782775339984 t/y, and T70 = 429.8339091474901 t/y.

Historical gross output benchmarks were T50 = IDR 40,830,353,158.2001, T60 = IDR 21,148,205,168.794533 and T70 = IDR 5,581,345,207.673375 annually.

| Threshold | New minus historical rice (t/y) | New minus historical gross value (IDR/y) |
| --- | ---: | ---: |
| T50 | +0.0000002584993 | +2.58 |
| T60 | +0.0000011817535 | +14.94 |
| T70 | +0.0000004119695 | +5.24 |

Acceptance checks: all 304 administrative keys present and unique, valid nonnegative model IP, 261/230/128 threshold-positive units, rice capacity residual no greater than 0.00001 t/y, output-value residual no greater than IDR 100/y, and registered threshold-area tolerance 0.000001 ha. **All checks pass.** Each T60 fresh village rice value was also compared against the original `Foregone_Desa` sheet, with maximum absolute deviation about 3.78e-7 t/y.

## Cropping-intensity coefficients and provisional T50 entries

The 304-unit economic comparison explicitly distinguishes:

- **230 locked T60 model coefficients**, imported directly from the historical workbook. Of these, 227 use the observed village ratio without model intervention, two were imputed from the district median because the village paddy-area denominator was missing, and one raw ratio greater than three was capped at three.
- **31 provisional T50-only coefficients** for units with mapped T50 area but zero T60 area. Their source is the published village-specific 2024 harvested/wetland area ratio and the already declared treatment rules. All 31 have an observed raw ratio. Two extreme provisional ratios were capped at three.
- **43 units with no mapped conversion** in any of the three threshold specifications. They contribute no modeled rice capacity and do not require an artificial IP.

The two provisional extreme cases are Desa Manting in Kecamatan Jatirejo, with a raw ratio of about 101.67, and Desa Nogosari in Kecamatan Pacet, with a raw ratio of about 3.67. Both were limited to three under the prespecified main-model treatment, while their unmodified raw indices remain available in the coefficient evidence file.

The 31 provisional T50-only units contribute **7.1689884296527095 ha** of the freshly calculated T50 conversion area and about **33.285390172035875 t of food-rice capacity annually**. This agrees with the manuscript's historical rounded 7.16899 ha and 33.28539 t/y. The T70-positive set is contained within the 230 locked T60-positive model units and needs no provisional coefficients.

## Source-precision and interpretive limitations

1. The BPS Kabupaten Mojokerto press release on final 2025 paddy production reports the regency harvested area, GKG and food-rice production in rounded thousand-unit figures. The archived model uses 51,750, 312,410 and 180,390 as fixed numerical inputs. Those integer inputs should be attributed to the study workbook and are consistent with the rounded press-release levels, but their unit-level precision should not be described as independently established by the press release alone.
2. Another archived provincial BPS summary reports nearby but not identical integer inputs. Avoid replacing the original study model inputs without separately evaluating the effect and checking table provenance.
3. The manuscript states an unrounded annual mean medium-rice milling price of IDR 12,984.88809 per kg. The current public BPS monthly price table displays monthly values rounded to whole rupiah, which produce a somewhat different average if directly reaveraged. The historical monetary result is reproduced **conditional on the manuscript's specified full-precision price**, not by independently recovering unrounded monthly microdata.
4. A provisional village coefficient transfers observed 2024 village cropping intensity to candidate pixels. It is not a site-specific observation of the cropping frequency formerly present on converted patches. The two raw extreme-value cases are especially important to label as capped model assumptions.
5. This verifies the downstream arithmetic from already verified Stage 8 masks and registered coefficients. Original Dynamic World classification, reference-image validation, spatial autocorrelation estimates and an area-adjusted omission error were not independently rerun.

## Primary external references

- BPS Kabupaten Mojokerto, final paddy production release for 2025, issued 6 March 2026:
  https://mojokertokab.bps.go.id/id/pressrelease/2026/03/06/66/luas-panen-dan-produksi-padi-di-kabupaten-mojokerto-2025--angka-tetap-.html
- BPS Indonesia, national monthly medium rice prices at milling level in 2025:
  https://www.bps.go.id/assets/statistics-table/2/MjI3NyMy/rata-rata-harga-beras-bulanan-di-tingkat-penggilingan-menurut-kualitas-.html

**Reproducibility status:** Stage 9 per-unit economic calculation and all three sensitivity totals PASS within stated numerical tolerances. Empirical parameter provenance and upstream detection accuracy remain separate research limitations.

**Next stage:** Recalculate global Moran's I and local spatial screening, explicitly separating conversion-area variables, annual-capacity variables, per-hectare indicators, false-discovery-rate adjustment, and the 12 historically exploratory candidates.
