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
