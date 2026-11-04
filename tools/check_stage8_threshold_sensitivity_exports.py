"""Verify GEE Stage 8 sensitivity area outputs against the archived Stage 7 table.

Pilot example:
  python tools/check_stage8_threshold_sensitivity_exports.py \
    --exports ./GEE_downloads \
    --reference data_derived/Stage7_304_Units_From_18_District_Exports.csv \
    --out qa_outputs/Stage8_Kutorejo_Threshold_Comparison.csv \
    --mode pilot

For all 18 completed files, use --mode full. This script never silently
substitutes archived values for fresh results and never treats blanks as zero.
Python standard library only. Exit status 0 means every requested check passed.
"""
import argparse
import csv
import re
from collections import Counter, defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path

PREFIX = "Mojokerto_Stage8_ThresholdGrid_"
TOL = Decimal("0.000001")
TOTALS = {
    "T50": Decimal("610.9156963323798"),
    "T60": Decimal("323.33406072288363"),
    "T70": Decimal("89.0284436968486"),
}
POSITIVE = {"T50": 261, "T60": 230, "T70": 128}
PILOT_TOTALS = {
    "T50": Decimal("55.51071220490999"),
    "T60": Decimal("27.63093313694076"),
    "T70": Decimal("5.867751710013591"),
}
PILOT_POSITIVE = {"T50": 17, "T60": 16, "T70": 10}
MULTIPART = {
    ("Kecamatan Gedeg", "Ngareskidul"),
    ("Kecamatan Gondang", "Kemasantani"),
    ("Kecamatan Jetis", "Mojorejo"),
    ("Kecamatan Mojosari", "Seduri"),
}
FIELDS = {
    "T50": "area_T50_ha",
    "T60": "area_T60_locked_ha",
    "T60_REBUILT": "area_T60_rebuilt_ha",
    "T70": "area_T70_ha",
}
FLAGS = ("missing_T50", "missing_T60_rebuilt", "missing_T60_locked", "missing_T70")
REFERENCE_FIELDS = {
    "T50": "area_T50_ha",
    "T60": "area_T60_ha",
    "T70": "area_T70_ha",
}


def nonnegative_decimal(value, context):
    if value is None or not str(value).strip():
        raise ValueError("Blank value: " + context)
    try:
        v = Decimal(str(value).strip())
    except InvalidOperation as exc:
        raise ValueError("Nonnumeric value: " + context) from exc
    if not v.is_finite() or v < 0:
        raise ValueError("Negative or nonfinite value: " + context)
    return v


def reference_rows(path, pilot):
    result = {}
    with path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            if pilot and r["KECAMATAN"] != "Kecamatan Kutorejo":
                continue
            key = (r["KECAMATAN"].strip(), r["DESAKEL"].strip())
            if key in result:
                raise ValueError("Duplicate historical village: " + str(key))
            result[key] = {
                t: nonnegative_decimal(r[col], str((key, col)))
                for t, col in REFERENCE_FIELDS.items()
            }
    return result


def source_rows(folder, pilot):
    files = sorted(folder.glob(PREFIX + "*.csv"))
    if pilot:
        files = [f for f in files if f.name == PREFIX + "09_Kutorejo.csv"]
        expected = set([9])
    else:
        expected = set(range(1, 19))
    indices = set()
    all_rows = defaultdict(lambda: defaultdict(lambda: Decimal(0)))
    parts = Counter()
    missing_flags = 0
    total_source_rows = 0

    if not files:
        raise ValueError("No new Stage 8 CSVs found for requested mode")
    for file in files:
        match = re.fullmatch(
            r"Mojokerto_Stage8_ThresholdGrid_(\d{2})_(.+)\.csv",
            file.name,
        )
        if not match:
            raise ValueError("Invalid file name: " + file.name)
        index = int(match.group(1))
        district = "Kecamatan " + match.group(2)
        if index in indices:
            raise ValueError("Duplicate district batch: " + str(index))
        indices.add(index)
        with file.open(encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)
            required = {"KECAMATAN", "DESAKEL"} | set(FIELDS.values()) | set(FLAGS)
            if not required.issubset(set(reader.fieldnames or [])):
                raise ValueError("Missing CSV fields in " + file.name)
            rows = list(reader)
        if not rows:
            raise ValueError("Empty CSV: " + file.name)
        for row in rows:
            key = (row["KECAMATAN"].strip(), row["DESAKEL"].strip())
            if not all(key) or key[0] != district:
                raise ValueError("Unexpected district-village: " + str(key))
            for flag in FLAGS:
                if nonnegative_decimal(row[flag], str((key, flag))) != 0:
                    missing_flags += 1
            for t, name in FIELDS.items():
                all_rows[key][t] += nonnegative_decimal(
                    row[name], str((key, name))
                )
            parts[key] += 1
            total_source_rows += 1
    if indices != expected:
        raise ValueError(
            "Expected district indices " + str(sorted(expected)) +
            ", found " + str(sorted(indices))
        )
    return {k: dict(v) for k, v in all_rows.items()}, parts, missing_flags, total_source_rows


def validate(args):
    pilot = args.mode == "pilot"
    reference = reference_rows(args.reference, pilot)
    fresh, parts, n_missing_flags, n_source_rows = source_rows(args.exports, pilot)
    keys = set(fresh) | set(reference)
    missing = set(reference) - set(fresh)
    extra = set(fresh) - set(reference)
    counts = {t: 0 for t in REFERENCE_FIELDS}
    totals = {t: Decimal(0) for t in FIELDS}
    max_delta = {t: Decimal(0) for t in FIELDS}
    failed = []
    output_rows = []

    for key in sorted(keys):
        computed = fresh.get(key)
        original = reference.get(key)
        if computed is None or original is None:
            continue
        row_out = {
            "KECAMATAN": key[0],
            "DESAKEL": key[1],
            "n_polygon_parts": parts[key],
        }
        for t in FIELDS:
            totals[t] += computed[t]
            if t in REFERENCE_FIELDS:
                old = original[t]
            else:
                old = original["T60"]
            delta = computed[t] - old
            max_delta[t] = max(max_delta[t], abs(delta))
            row_out["fresh_" + t + "_ha"] = str(computed[t])
            row_out["historical_" + t + "_ha"] = str(old)
            row_out["delta_" + t + "_ha"] = str(delta)
            if abs(delta) > TOL:
                failed.append((key, t, str(delta)))
        for t in REFERENCE_FIELDS:
            if computed[t] > 0:
                counts[t] += 1
        if computed["T50"] + TOL < computed["T60"] or (
            computed["T60"] + TOL < computed["T70"]
        ):
            failed.append((key, "nonmonotonic_thresholds", ""))
        if abs(computed["T60_REBUILT"] - computed["T60"]) > TOL:
            failed.append((key, "T60_rebuilt_vs_locked", ""))
        output_rows.append(row_out)

    expected_parts = 17 if pilot else 308
    expected_units = 17 if pilot else 304
    expected_totals = PILOT_TOTALS if pilot else TOTALS
    expected_positive = PILOT_POSITIVE if pilot else POSITIVE
    checks = {
        "Source polygon-part count": n_source_rows == expected_parts,
        "Unique administrative units": len(fresh) == expected_units,
        "Missing administrative keys": not missing,
        "Unexpected administrative keys": not extra,
        "Reducer null flag count": n_missing_flags == 0,
        "Positive-unit counts": counts == expected_positive,
        "All per-unit areas and T60 controls": len(failed) == 0,
        "Threshold totals": all(
            abs(totals[t] - expected_totals[t]) <= TOL
            for t in REFERENCE_FIELDS
        ),
    }
    if pilot:
        checks["No multipart units in pilot"] = all(v == 1 for v in parts.values())
    else:
        checks["Four expected multipart units"] = {
            k for k, n in parts.items() if n > 1
        } == MULTIPART and all(n <= 2 for n in parts.values())
    args.out.parent.mkdir(parents=True, exist_ok=True)
    columns = (
        ["KECAMATAN", "DESAKEL", "n_polygon_parts"] +
        [
            name
            for t in FIELDS
            for name in (
                "fresh_" + t + "_ha",
                "historical_" + t + "_ha",
                "delta_" + t + "_ha",
            )
        ]
    )
    with args.out.open("w", encoding="utf-8", newline="") as out:
        writer = csv.DictWriter(out, fieldnames=columns)
        writer.writeheader()
        writer.writerows(output_rows)

    print("Mode", args.mode)
    print("Input polygon parts", n_source_rows)
    print("Unique units", len(fresh))
    print("Positive units", counts)
    print("Missing reducer flags", n_missing_flags)
    print("Totals (ha)", {k: str(v) for k, v in totals.items()})
    print("Maximum per-unit differences (ha)", {
        k: str(v) for k, v in max_delta.items()
    })
    print("Unexpected or missing keys", len(extra), len(missing))
    print("Per-unit discrepancies", len(failed))
    for item in sorted(failed, key=lambda z: z[0])[:12]:
        print("Difference", item)
    for name, ok in checks.items():
        print(("PASS" if ok else "FAIL") + " | " + name)
    print("Comparison CSV", args.out)
    if not all(checks.values()):
        print("NOT VERIFIED: retain historical figures until discrepancies explained")
        return 1
    print("PASS: fresh T50/T70 sensitivity areas match historical Stage 7")
    print("This does not independently reproduce Dynamic World Stage 1-3")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("pilot", "full"), default="pilot")
    parser.add_argument("--exports", required=True, type=Path)
    parser.add_argument("--reference", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    raise SystemExit(validate(parser.parse_args()))
