"""Reconcile 18 GEE Stage 6 weighted-area CSV exports with Stage 7 archive.

Source CSVs from gee/07_stage6_locked_304_village_weighted_BATCH.js.
Export 308 original polygon-part rows, then aggregate to 304 district-village
units. A weighted area reducer is REQUIRED, not the pixel-centre unweighted sum.

Example:
  python tools/check_stage6_village_weighted_exports.py \
    --exports GEE_downloads \
    --reference data_derived/Stage7_304_Units_From_18_District_Exports.csv \
    --out qa_outputs/Stage6_304_Village_Weighted_Fresh_QC.csv

Requires only Python standard library. Exits nonzero if any check fails.
Does not change either input, original research assets or source CSVs.
"""

import argparse
import csv
import re
import sys
from collections import Counter, defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path

PREFIX = "Mojokerto_Stage6_VillageWeighted_"
HISTORICAL_HA = Decimal("323.33406072288363")
MAX_ACCEPTED_ABS_HA = Decimal("0.000001")
EXPECTED_POSITIVE = 230
EXPECTED_POLYGONS = 308
EXPECTED_UNITS = 304
EXPECTED_DISTRICTS = 18
EXPECTED_MULTIPART = {
    ("Kecamatan Gedeg", "Ngareskidul"),
    ("Kecamatan Gondang", "Kemasantani"),
    ("Kecamatan Jetis", "Mojorejo"),
    ("Kecamatan Mojosari", "Seduri"),
}


def read_area(value, where):
    if value is None or not str(value).strip():
        raise ValueError(f"{where}: BLANK area field in GEE export. Cannot interpret missing values as zero")
    try:
        result = Decimal(str(value).strip())
    except InvalidOperation as exc:
        raise ValueError(f"{where}: invalid numeric area {value!r}") from exc
    if not result.is_finite() or result < 0:
        raise ValueError(f"{where}: area must be finite and nonnegative")
    return result


def read_reference(path):
    result = {}
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            key = (row["KECAMATAN"].strip(), row["DESAKEL"].strip())
            if key in result:
                raise ValueError(f"Duplicate key in historical reference: {key}")
            result[key] = read_area(row["area_T60_ha"], str(key))
    return result


def read_exports(folder):
    files = sorted(folder.glob(PREFIX + "*.csv"))
    if not files:
        raise ValueError("No Stage 6 village-weighted exports found in the directory")

    observed_batches = []
    unit_areas = defaultdict(lambda: Decimal(0))
    parts = Counter()
    per_district_files = {}
    total_rows = 0

    for file in files:
        matched = re.fullmatch(
            r"Mojokerto_Stage6_VillageWeighted_(\d{2})_(.+)\.csv",
            file.name,
        )
        if not matched:
            raise ValueError(f"Unexpected filename: {file.name}")
        batch_num = int(matched.group(1))
        district_name = "Kecamatan " + matched.group(2)
        if batch_num in observed_batches or district_name in per_district_files:
            raise ValueError(f"Duplicate export for batch {batch_num}")
        observed_batches.append(batch_num)
        per_district_files[district_name] = file.name

        with file.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            required = {"KECAMATAN", "DESAKEL", "area_T60_ha"}
            if not required.issubset(set(reader.fieldnames or [])):
                raise ValueError(f"{file.name} missing required columns")
            rows = list(reader)
            if not rows:
                raise ValueError(f"Empty district export: {file.name}")
            for row in rows:
                key = (row["KECAMATAN"].strip(), row["DESAKEL"].strip())
                if not all(key) or key[0] != district_name:
                    raise ValueError(f"Unexpected administrative key in {file.name}: {key}")
                unit_areas[key] += read_area(row["area_T60_ha"], f"{file.name}: {key}")
                parts[key] += 1
                total_rows += 1

    if set(observed_batches) != set(range(1, 19)):
        missing = sorted(set(range(1, 19)) - set(observed_batches))
        raise ValueError(f"Missing or unexpected district batch numbers: {missing}")

    return unit_areas, parts, total_rows, per_district_files


def write_summary(out, new, historical):
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow([
            "KECAMATAN", "DESAKEL", "fresh_T60_ha",
            "historical_T60_ha", "delta_ha", "fresh_positive",
            "historical_positive",
        ])
        for key in sorted(set(new) | set(historical)):
            fresh = new.get(key, Decimal(0))
            archived = historical.get(key, Decimal(0))
            writer.writerow([
                *key, str(fresh), str(archived), str(fresh - archived),
                int(fresh > 0), int(archived > 0),
            ])


def main(args):
    fresh, part_count, n_rows, district_files = read_exports(args.exports)
    archived = read_reference(args.reference)

    missing_keys = sorted(set(archived) - set(fresh))
    extra_keys = sorted(set(fresh) - set(archived))
    actual_multipart = {key for key, count in part_count.items() if count > 1}
    expected_duplicates = {
        key for key, count in part_count.items() if count == 2
    }

    all_keys = sorted(set(fresh) | set(archived))
    discrepancies = [
        (key, fresh.get(key, Decimal(0)) - archived.get(key, Decimal(0)))
        for key in all_keys
    ]
    discrepant = [(key, d) for key, d in discrepancies if abs(d) > MAX_ACCEPTED_ABS_HA]
    discrepant.sort(key=lambda item: abs(item[1]), reverse=True)

    fresh_area = sum(fresh.values(), Decimal(0))
    reference_area = sum(archived.values(), Decimal(0))
    fresh_positive = sum(value > 0 for value in fresh.values())
    reference_positive = sum(value > 0 for value in archived.values())
    max_abs_diff = max((abs(d) for _, d in discrepancies), default=Decimal(0))

    validations = {
        "18 district CSVs": len(district_files) == EXPECTED_DISTRICTS,
        "308 original polygon parts": n_rows == EXPECTED_POLYGONS,
        "304 unique administrative units": len(fresh) == EXPECTED_UNITS,
        "No missing keys": not missing_keys,
        "No extra keys": not extra_keys,
        "Four expected multipart units": actual_multipart == EXPECTED_MULTIPART
        and expected_duplicates == EXPECTED_MULTIPART,
        "Reference 230 positive units": reference_positive == EXPECTED_POSITIVE,
        "Fresh 230 positive units": fresh_positive == EXPECTED_POSITIVE,
        "Fresh total matches locked reference": (
            abs(fresh_area - HISTORICAL_HA) <= MAX_ACCEPTED_ABS_HA
        ),
        "Per-unit maximum area difference within tolerance": (
            max_abs_diff <= MAX_ACCEPTED_ABS_HA
        ),
    }

    print(f"Fresh polygon parts: {n_rows}")
    print(f"Fresh unique units: {len(fresh)}")
    print(f"Fresh positive units: {fresh_positive}")
    print(f"Historical reference positive units: {reference_positive}")
    print(f"Fresh area T60 ha: {fresh_area}")
    print(f"Archived area T60 ha: {reference_area}")
    print(f"Delta T60 ha: {fresh_area - reference_area}")
    print(f"Maximum absolute per-unit difference ha: {max_abs_diff}")
    if missing_keys:
        print(f"Missing district-village keys: {missing_keys[:10]}")
    if extra_keys:
        print(f"Unexpected district-village keys: {extra_keys[:10]}")
    if discrepant:
        print("Largest unit area discrepancies:")
        for key, delta in discrepant[:10]:
            print(f"  {key}: {delta} ha")

    write_summary(args.out, fresh, archived)
    print(f"Comparison CSV: {args.out}")
    for name, passed in validations.items():
        print(("PASS" if passed else "FAIL") + " | " + name)
    if not all(validations.values()):
        print("REQUIRES INVESTIGATION: do not change manuscript values")
        return 1
    print("PASS: archived 304-unit / 230-positive Stage 6 areas reproduced")
    print("This is NOT an independent rerun of Stage 1-3 classification")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--exports", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    sys.exit(main(parser.parse_args()))
