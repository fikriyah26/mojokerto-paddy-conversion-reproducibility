# Stage 7 GEE weighted-area export failure: blank numeric fields

**Checked:** 4 November 2026, from user's connected Google Drive folder
https://drive.google.com/drive/folders/1i60YJHaWVNFUIWUi_FEa4cX0uObQB6Z9

## Observed source files

All 18 newly exported files following the pattern
`Mojokerto_Stage6_VillageWeighted_01_Bangsal.csv` through
`Mojokerto_Stage6_VillageWeighted_18_Trowulan.csv`
were retrieved and parsed.

- Number of CSVs: **18**, one for each district.
- Polygon-part rows: **308**.
- Distinct `KECAMATAN + DESAKEL` keys: **304**.
- Exactly four duplicate village keys, representing historically known multipart boundaries:
  Kecamatan Gedeg / Ngareskidul, Kecamatan Gondang / Kemasantani,
  Kecamatan Jetis / Mojorejo, Kecamatan Mojosari / Seduri.
- Header: `KECAMATAN,DESAKEL,area_T60_ha`.
- **Nonblank values for area_T60_ha: 0 of 308**.
- The numeric area field is blank on every data row, including units that have substantial positive T60 area in the historical archive.

## Conclusion

**Export field/value QC: FAILED.** The 18 exports are **not** evidence of zero conversion area and cannot establish a 304-village or 230-positive-unit match. Interpreting blank cells as zero is invalid.

The source JavaScript `gee/07_stage6_locked_304_village_weighted_BATCH.js` uses a single-band `ee.Image.reduceRegions({reducer: ee.Reducer.sum()})`, followed by `f.get('area_T60_ha')`. The reduced-output property name could differ from the assumed key, or the reducer value could be absent for another reason. The actual `Feature.propertyNames()` and direct zonal result were not saved in the CSV because the export only selected the three final fields. **Root cause not yet established.**

## Corrective steps

1. Run `gee/07a_diagnose_weighted_reducer_output_READ_ONLY.js` on one known-positive unit, Kecamatan Kutorejo / Pesanggrahan. That unit has a historical T60 weighted reference area of **7.383299456212667 ha**.
2. Inspect the raw single-band `reduceRegions` feature, output property names and values, a two-band control and direct `reduceRegion` result.
3. After the output field and area are validated, use an amended exporter that fails closed if a numeric field is missing. Test its **one-district** CSV first.
4. Do not repeat all 18 batch exports until the one-district CSV contains valid numeric areas and reproduces the historical district entries.
5. The companion checker `tools/check_stage6_village_weighted_exports.py` now rejects blank area strings explicitly, rather than treating them as zero.

Historical benchmark remains: **304** unique units, **230** positive units, **323.33406072288363 ha** from the archived weighted Stage 7 exports. The previously completed 18-district **pixel-centre** mask identity check remains valid and is a distinct test.


## Corrective one-district result, 4 November 2026

The author ran `gee/07b_test_weighted_Kutorejo_DIRECT_REDUCE.js` in the historical GEE account. Console reported 17 original polygon parts for Kecamatan Kutorejo and a sample T60 result for Desa Pesanggrahan of **7.38329945621264 ha**, compared with the archived **7.383299456212667 ha** (difference approximately -2.66e-14 ha).

The completed Drive CSV `Mojokerto_Stage7_WeightedFix_Test_09_Kutorejo.csv` was retrieved from
https://drive.google.com/file/d/1jSvlrV8pN0Z0ioIeLumzqnigUf-BAIW0/view

**All 17 area fields are numeric.** However, comparison with the archived original Stage 7 304-unit table reveals five discrepancies above the pre-registered 0.000001 ha per-unit threshold:

| Unit | Fresh direct-reduce ha | Historical ha | Fresh minus historical ha |
| --- | ---: | ---: | ---: |
| Desa Kepuhpandak, Kecamatan Kutorejo | 1.4252579691209968 | 1.427440736742207 | -0.00218276762121028 |
| Desa Windurejo, Kecamatan Kutorejo | 0.4640363033967859 | 0.4655677938274307 | -0.0015314904306447663 |
| Desa Wonodadi, Kecamatan Kutorejo | 2.3162511550005744 | 2.316863789137298 | -0.0006126341367234112 |
| Desa Kaligoro, Kecamatan Kutorejo | 1.7551750852457673 | 1.755481434347115 | -0.00030634910134774707 |
| Desa Kepuharum, Kecamatan Kutorejo | 0.5225574152838015 | 0.5226339882794547 | -0.00007657299565322351 |

The other 12 of 17 villages pass the tolerance check.

- Fresh district total: **27.62622332265515 ha**.
- Historical district total from the reconciled table: **27.63093313694076 ha**.
- Fresh minus historical: **-0.00470981428561 ha**.

Evidence: `qa_outputs/Mojokerto_Stage7_WeightedFix_Test_09_Kutorejo_2026-11-04.csv` and `qa_outputs/Mojokerto_Stage7_Kutorejo_PerVillage_Differences_2026-11-04.csv`.

**Status:** Fixed blank columns, but direct-reduce method FAILS exact per-village reproduction for 5 of 17 villages. No all-district rerun should be requested with this method yet. A narrow six-village comparison of `updateMask` versus zero-filled input, single-band versus multiband `reduceRegions`, and direct per-feature reduction is prepared as `gee/07c_compare_masked_zonal_methods_Kutorejo.js`. This study does not yet establish which factor caused the five discrepancies. The original archive totals remain unchanged.


## Confirmed explanation from the six-village weighted-method diagnostic

The author completed GEE script `gee/07c_compare_masked_zonal_methods_Kutorejo.js` and supplied the resulting CSV, hosted at:
https://drive.google.com/file/d/1ilajWGLKuW1dDrxuERxFdvdy00H2BJqe/view

The unchanged evidence CSV was saved under `qa_outputs/Mojokerto_Stage7_Weighted_Methods_QC_Kutorejo_2026-11-04.csv`.

**All six samples** agree with the historical area-weighted archive to numerical precision when pixel area is calculated using `ee.Image.pixelArea().divide(10000).updateMask(locked.eq(1).selfMask())`, without zero-filling the conversion mask before calculating the area. The comparison included Desa Kaligoro, Desa Kepuharum, Desa Kepuhpandak, Desa Pesanggrahan, Desa Windurejo and Desa Wonodadi, all in Kecamatan Kutorejo. Five of six samples differ from the historical archive when the image is calculated by multiplying pixelArea by `locked.eq(1).unmask(0)`, and Desa Pesanggrahan happens to agree under either representation.

The single-band `ee.Image.reduceRegions` output contains a numeric field named **`sum`** for these six positive samples. The named `area_T60_ha` field is blank because that property is absent in the single-band output. A three-band `reduceRegions` returns a correctly named `area_T60_ha` band property. This accounts for the 308 blank numeric fields from the initial exports.

The masked versus zero-filled area difference is an observed GEE effect in these six cases. Its exact pixel-by-pixel fractional-weighting mechanism has not been independently isolated beyond the method comparison, so avoid extending a numerical claim beyond the tested locations.

**Corrected verified export script:** `gee/07d_stage7_weighted_corrected_18_district_BATCH.js`, which uses the original locked Stage 6 image, retains `updateMask`, reads `f.get('sum')`, exposes a `raw_sum_missing` diagnostic and exports one district at a time before the complete 18-district rerun. The Python validator `tools/check_stage6_village_weighted_exports.py` was amended to accept files with the `Mojokerto_Stage7_WeightedCorrected_` prefix and still reject blank area values.

This evidence supports the corrective method but the fresh entire 304-unit area reconciliation still must be executed and validated. The user's original historical figures remain unchanged.
