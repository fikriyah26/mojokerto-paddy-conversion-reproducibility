"""Aggregate 18 district-level GEE locked-grid comparison CSV exports.

Usage:
  python tools/check_stage6_locked_grid_exports.py /path/to/GEE_exports

The input folder should contain the 18 files named
Mojokerto_Stage6_GridQC_XX_District.csv created by GEE script 06.
This program does not claim any raster identity until all 18 results are present.
"""
from __future__ import annotations
import argparse
import csv
from pathlib import Path

EXPECTED = [
    "Kecamatan Bangsal",
    "Kecamatan Dawarblandong",
    "Kecamatan Dlanggu",
    "Kecamatan Gedeg",
    "Kecamatan Gondang",
    "Kecamatan Jatirejo",
    "Kecamatan Jetis",
    "Kecamatan Kemlagi",
    "Kecamatan Kutorejo",
    "Kecamatan Mojoanyar",
    "Kecamatan Mojosari",
    "Kecamatan Ngoro",
    "Kecamatan Pacet",
    "Kecamatan Pungging",
    "Kecamatan Puri",
    "Kecamatan Sooko",
    "Kecamatan Trawas",
    "Kecamatan Trowulan",
]
MEASURES = (
    "locked_pixels",
    "rebuilt_pixels",
    "mismatch_pixels",
    "locked_only_pixels",
    "rebuilt_only_pixels",
    "locked_ha",
    "rebuilt_ha",
    "mismatch_ha",
    "locked_only_ha",
    "rebuilt_only_ha",
)


def main(folder: Path) -> int:
    records = {}
    files = sorted(folder.glob("Mojokerto_Stage6_GridQC_*.csv"))
    for filepath in files:
        with filepath.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        if len(rows) != 1:
            raise ValueError(f"{filepath.name}: expected one CSV row, got {len(rows)}")
        row = rows[0]
        district = row["district"]
        if district not in EXPECTED:
            raise ValueError(f"Unexpected district: {district}")
        if district in records:
            raise ValueError(f"Duplicate district export: {district}")
        records[district] = {key: float(row[key]) for key in MEASURES}

    missing = [district for district in EXPECTED if district not in records]
    print(f"CSV exports found: {len(files)}, distinct districts: {len(records)} of 18")
    if missing:
        print("MISSING:", ", ".join(missing))

    differing = []
    for district in EXPECTED:
        if district not in records:
            continue
        row = records[district]
        equal_pixels = (
            row["mismatch_pixels"] == 0
            and row["locked_only_pixels"] == 0
            and row["rebuilt_only_pixels"] == 0
            and row["locked_pixels"] == row["rebuilt_pixels"]
        )
        if not equal_pixels:
            differing.append((district, row["mismatch_pixels"]))
        print(
            f"{district}: locked={row['locked_pixels']:.0f}, "
            f"rebuilt={row['rebuilt_pixels']:.0f}, "
            f"mismatched={row['mismatch_pixels']:.0f}"
        )

    if records:
        print("SUMS FOR PIXEL-CENTRE ALLOCATION ONLY")
        for measure in MEASURES:
            print(measure, sum(row[measure] for row in records.values()))
    if differing:
        print("DISTRICTS WITH DIFFERENCES:", differing)
    if missing:
        print("INCOMPLETE: no conclusion for all 18 districts")
        return 2
    if differing:
        print("FAIL: at least one district has mismatched pixel centres")
        return 1
    print("PASS: all 18 districts show zero pixel-centre mismatches")
    print("This does not verify the historical processing script or exact")
    print("area-weighted administrative reductions for 304 village units.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("folder", type=Path)
    raise SystemExit(main(parser.parse_args().folder))
