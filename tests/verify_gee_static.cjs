// Offline source-config verification only. Does not run Google Earth Engine.
const fs = require('node:fs')
const assert = require('node:assert/strict')
const {spawnSync} = require('node:child_process')
const root = require('node:path').join(__dirname, '..')
const source = fs.readFileSync(root + '/gee/Mojokerto_GEE_Stages_1_to_6.js', 'utf8')
const diagnosticPath = root + '/gee/00_preflight_assets_DIAGNOSTIC.js'
for (const file of [root + '/gee/Mojokerto_GEE_Stages_1_to_6.js', diagnosticPath]) {
  const r = spawnSync(process.execPath, ['--check', file], {encoding:'utf8'})
  assert.equal(r.status, 0, file + '\n' + r.stderr)
}
for (const entry of [
  "var CONFIG_ID = 'MOJ_T60_BASE1719_END2325_PATCH5_8N_v1'",
  "var DW_COLLECTION = 'GOOGLE/DYNAMICWORLD/V1'",
  'var BASELINE_YEARS = [2017, 2018, 2019]',
  'var END_YEARS = [2023, 2024, 2025]',
  'var CROP_P75_MIN = 0.40',
  'var CROP_FREQ_MIN = 0.20',
  'var MIN_VALID_OBSERVATIONS = 5',
  'var PATCH_MIN_PIXELS = 5',
  'var PATCH_MAXSIZE = 1024',
  'var PATCH_EIGHT_CONNECTED = true',
  "var AREA_CRS = 'EPSG:32749'"
]) assert.ok(source.includes(entry), 'Missing historical setting: ' + entry)
assert.ok(source.includes("users/fikriiyah26/Mojokerto_Stage3_ConversionMask"), 'Wrong historical Stage 3 asset path')
assert.ok(!source.includes("users/fikriyah26/Mojokerto_Stage3_ConversionMask"), 'Legacy username typo')
for(let s=1; s<=6; s++) assert.ok(source.includes('ACTIVE_STAGE === ' + s))
const diagnostic = fs.readFileSync(diagnosticPath,'utf8')
assert.ok(!diagnostic.includes('Export.image.toAsset'), 'Diagnostic should not overwrite assets')
assert.ok(!diagnostic.includes('Export.table.toDrive'), 'Diagnostic should not export tables')
assert.ok(!diagnostic.includes('Export.image.toDrive'), 'Diagnostic should not export imagery')
console.log('PASS: local syntax, configuration and diagnostic read-only checks')
console.log('NOT TESTED: authenticated Earth Engine execution or historical raster identity')
