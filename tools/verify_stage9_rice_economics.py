#!/usr/bin/env python3
"""Reproduce Stage 9 rice-capacity and gross-output results by 304 village units.

Inputs are recorded historical research parameters, the freshly verified GEE
Stage 8 village areas and 304 explicitly attributed cropping-intensity coefficients.

No source workbook or GEE asset is changed. No precision adjustment, arbitrary
scaling, post-hoc coefficient fitting or imputation is performed inside this tool.
Recompute from the repository root with Python 3, standard library only:

    python tools/verify_stage9_rice_economics.py

Outputs:
    qa_outputs/Stage9_Rice_Economics_Recalculated_304_Units.csv
    qa_outputs/Stage9_Rice_Economics_Recalculated_Summary.csv

Science notes:
- Rice = area * cropping intensity * (312410/51750) * (180390/312410).
- Historical workbook inputs are rounded 2025 BPS regency production totals.
- 12984.88809 Rp/kg is the full-precision value transcribed in the manuscript,
  which is not independently reconstructible from rounded monthly BPS prices.
- 31 extra T50 unit coefficients were provisionally derived from observed 2024
  cropping-intensity data and the same historical treatment rules.
- Annual capacity equivalence is NOT observed cumulative production loss,
  farmers' net income, or an area-adjusted classification estimate.
"""
from __future__ import annotations

import argparse
import csv
import math
from collections import Counter
from pathlib import Path

GKG_PRODUCTION_2025_TONNES = 312410.0
HARVESTED_AREA_2025_HA = 51750.0
FOOD_RICE_2025_TONNES = 180390.0
PRICE_MILLING_MEDIUM_RP_PER_KG = 12984.88809

YIELD_GKG = GKG_PRODUCTION_2025_TONNES / HARVESTED_AREA_2025_HA
GKG_TO_RICE = FOOD_RICE_2025_TONNES / GKG_PRODUCTION_2025_TONNES

AREA_COLUMNS = {
    "T50": "fresh_T50_ha",
    "T60": "fresh_T60_locked_ha",
    "T70": "fresh_T70_ha",
}
HISTORICAL = {
    "T50": {"area": 610.9156963323798, "rice": 3144.451679092195,
            "gross": 40830353158.2001, "positive": 261},
    "T60": {"area": 323.33406072288363, "rice": 1628.6782775339984,
            "gross": 21148205168.794533, "positive": 230},
    "T70": {"area": 89.0284436968486, "rice": 429.8339091474901,
            "gross": 5581345207.673375, "positive": 128},
}
AREA_TOL = 0.000001
RICE_TOL = 0.00001
RUPIAH_TOL = 100.0
EXTRA_T50_AREA = 7.168988455334832
EXTRA_T50_RICE = 33.28539


def read_keyed(path: Path) -> dict:
    data = {}
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for line in csv.DictReader(handle):
            district, village = line["KECAMATAN"].strip(), line["DESAKEL"].strip()
            key = (district, village)
            if not district.startswith("Kecamatan ") or not village:
                raise ValueError(f"Invalid administrative identity {key}")
            if key in data:
                raise ValueError(f"Duplicate administrative identity {key}")
            data[key] = line
    return data


def positive_float(value: str, name: str, allow_zero=True) -> float:
    if value is None or not value.strip():
        raise ValueError(f"Blank value for {name}")
    amount = float(value)
    if not math.isfinite(amount) or amount < 0 or (
            not allow_zero and amount == 0):
        raise ValueError(f"Invalid nonnegative value for {name}: {value!r}")
    return amount


def csv_write(path: Path, columns: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def run(areas_path: Path, coeff_path: Path, out_dir: Path) -> int:
    areas, coefficients = read_keyed(areas_path), read_keyed(coeff_path)
    if len(areas) != 304 or len(coefficients) != 304:
        raise ValueError("Stage 9 requires exactly 304 unique area and CI rows")
    if set(areas) != set(coefficients):
        raise ValueError("GEE area and coefficient administrative keys differ")

    totals = {
        t: dict(area=0.0, harvest=0.0, gkg=0.0, rice=0.0,
                gross=0.0, positive=0)
        for t in HISTORICAL
    }
    statuses = Counter()
    treatments = Counter()
    detailed = []
    provisional_extra_area = 0.0
    provisional_extra_rice = 0.0
    failures = []

    for key in sorted(areas):
        av, cv = areas[key], coefficients[key]
        ci = positive_float(cv["model_ip"], str(key) + " model IP")
        status = cv["coefficient_status"]
        treatment = cv["model_treatment"]
        statuses[status] += 1
        treatments[treatment] += 1

        threshold_areas = {
            t: positive_float(av[col], str(key) + " " + col)
            for t, col in AREA_COLUMNS.items()
        }
        rebuilt60 = positive_float(
            av["fresh_T60_rebuilt_ha"], str(key) + " rebuilt T60")
        if abs(rebuilt60 - threshold_areas["T60"]) > AREA_TOL:
            failures.append(f"Original locked and rebuilt T60 differ: {key}")
        if threshold_areas["T50"] + AREA_TOL < threshold_areas["T60"] or (
            threshold_areas["T60"] + AREA_TOL < threshold_areas["T70"]
        ):
            failures.append(f"Threshold nesting differs: {key}")

        if status == "LOCKED_T60_MODEL":
            if threshold_areas["T60"] <= 0:
                failures.append(f"Locked coefficient without positive T60: {key}")
        elif status == "PROVISIONAL_T50_EXTRA":
            if threshold_areas["T50"] <= 0 or threshold_areas["T60"] != 0:
                failures.append(f"Incorrect T50 provisional status: {key}")
        elif status == "NO_CONVERSION_ALL_THRESHOLDS":
            if any(x > 0 for x in threshold_areas.values()):
                failures.append(f"Unmodeled positive area: {key}")
        else:
            failures.append(f"Unrecognized coefficient status: {key}")

        row = {
            "KECAMATAN": key[0],
            "DESAKEL": key[1],
            "model_ip": ci,
            "coefficient_status": status,
        }
        for t, area in threshold_areas.items():
            harvest = area * ci
            gkg = harvest * YIELD_GKG
            rice = gkg * GKG_TO_RICE
            gross = rice * 1000 * PRICE_MILLING_MEDIUM_RP_PER_KG

            row[t + "_area_ha"] = area
            row[t + "_harvest_ha_per_year"] = harvest
            row[t + "_GKG_t_per_year"] = gkg
            row[t + "_rice_t_per_year"] = rice
            row[t + "_gross_output_rp_per_year"] = gross

            s = totals[t]
            s["area"] += area
            s["harvest"] += harvest
            s["gkg"] += gkg
            s["rice"] += rice
            s["gross"] += gross
            s["positive"] += int(area > 0)

            if t == "T50" and status == "PROVISIONAL_T50_EXTRA":
                provisional_extra_area += area
                provisional_extra_rice += rice

        detailed.append(row)

    if statuses != {
        "LOCKED_T60_MODEL": 230,
        "PROVISIONAL_T50_EXTRA": 31,
        "NO_CONVERSION_ALL_THRESHOLDS": 43,
    }:
        failures.append(f"Unexpected coefficient statuses: {statuses}")
    if treatments["PROVISIONAL_CAP_3"] != 2:
        failures.append("Expected two capped provisional T50 coefficients")
    if treatments["IMPUTED_DISTRICT_MEDIAN"] != 2:
        failures.append("Expected two historical T60 IP imputations")
    if treatments["CAPPED_AT_3"] != 1:
        failures.append("Expected one historical T60 capped IP coefficient")
    if abs(provisional_extra_area - EXTRA_T50_AREA) > AREA_TOL:
        failures.append("Provisional T50 extra area not reproduced")
    if abs(provisional_extra_rice - EXTRA_T50_RICE) > RICE_TOL:
        failures.append("Provisional T50 extra rice capacity not reproduced")

    comparison = []
    for t, expected in HISTORICAL.items():
        s = totals[t]
        delta_area = s["area"] - expected["area"]
        delta_rice = s["rice"] - expected["rice"]
        delta_value = s["gross"] - expected["gross"]
        passed = (
            abs(delta_area) <= AREA_TOL and
            abs(delta_rice) <= RICE_TOL and
            abs(delta_value) <= RUPIAH_TOL and
            s["positive"] == expected["positive"]
        )
        if not passed:
            failures.append(f"{t} economic total differs from archive")
        comparison.append({
            "threshold": t,
            "conversion_area_ha": s["area"],
            "foregone_harvest_area_ha_per_year": s["harvest"],
            "foregone_GKG_t_per_year": s["gkg"],
            "foregone_rice_t_per_year": s["rice"],
            "gross_rice_output_rp_per_year": s["gross"],
            "positive_units": s["positive"],
            "historical_rice_t_per_year": expected["rice"],
            "difference_rice_t_per_year": delta_rice,
            "historical_gross_output_rp_per_year": expected["gross"],
            "difference_gross_output_rp_per_year": delta_value,
            "status": "PASS" if passed else "FAIL",
        })

    columns = [
        "KECAMATAN", "DESAKEL", "coefficient_status", "model_ip",
    ] + [
        f"{t}_{metric}" for t in HISTORICAL
        for metric in [
            "area_ha", "harvest_ha_per_year", "GKG_t_per_year",
            "rice_t_per_year", "gross_output_rp_per_year"
        ]
    ]
    csv_write(out_dir / "Stage9_Rice_Economics_Recalculated_304_Units.csv",
              columns, detailed)
    csv_write(out_dir / "Stage9_Rice_Economics_Recalculated_Summary.csv",
              list(comparison[0]), comparison)

    print("Source area keys:", len(areas))
    print("Coefficient status:", dict(statuses))
    print("Provisional T50 additional area, ha:", provisional_extra_area)
    print("Provisional T50 additional rice, t/year:", provisional_extra_rice)
    print("Yield GKG tonnes/harvested hectare:", YIELD_GKG)
    print("Effective GKG-to-rice factor:", GKG_TO_RICE)
    print("Assumed full-precision rice price, Rp/kg:",
          PRICE_MILLING_MEDIUM_RP_PER_KG)
    for row in comparison:
        print(row)
    if failures:
        for failure in failures:
            print("FAIL:", failure)
        return 1
    print("PASS: all 304-unit T50 T60 T70 economic indicators match archived")
    print("research estimates at preregistered numerical tolerances.")
    print("Caveat: 31 T50 coefficients are provisional, not T60-locked.")
    return 0


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument(
        "--areas", type=Path,
        default=Path(
            "qa_outputs/Mojokerto_Stage8_ThresholdGrid_304_Unit_Comparison_"
            "2026-11-04.csv"))
    p.add_argument(
        "--coefficients", type=Path,
        default=Path(
            "data_derived/Stage9_Rice_Coefficients_304_Units_2026-11-04.csv"))
    p.add_argument("--out-dir", type=Path, default=Path("qa_outputs"))
    args = p.parse_args()
    raise SystemExit(run(args.areas, args.coefficients, args.out_dir))
