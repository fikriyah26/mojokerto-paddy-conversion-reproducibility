"""Pixel-centre audit of archived binary Stage 6 GeoTIFF.

Requires geopandas, numpy, rasterio, pandas and pyproj.
Example:
  python tools/verify_locked_stage6_tif_offline.py --tif locked.tif \
    --admin Mojokerto_Admin_RTRW_304.shp --out locked_stage6_qc.csv

The source GeoTIFF and administrative geometries are not redistributed here.
This is not an exact substitute for GEE weighted zonal reduction.
"""
import argparse
from pathlib import Path
import geopandas as gpd
import numpy as np
import rasterio
from pyproj import Geod, Transformer


def calculate(tif: Path, admin: Path, out: Path):
    with rasterio.open(tif) as raster:
        rows, cols = np.where(raster.read(1) == 1)
        x, y = rasterio.transform.xy(raster.transform, rows, cols, offset="center")
        converter = Transformer.from_crs(raster.crs, "EPSG:4326", always_xy=True)
        geod = Geod(ellps="WGS84")
        geodesic_area_by_row = {}
        for row in np.unique(rows):
            left, top = rasterio.transform.xy(raster.transform, int(row), 0, offset="ul")
            right, bottom = rasterio.transform.xy(raster.transform, int(row), 0, offset="lr")
            lon, lat = converter.transform(
                [left, right, right, left], [top, top, bottom, bottom]
            )
            area, _ = geod.polygon_area_perimeter(lon, lat)
            geodesic_area_by_row[row] = abs(area) / 10000

        areas = np.array([geodesic_area_by_row[row] for row in rows])
        points = gpd.GeoDataFrame(
            {"area_ha": areas},
            geometry=gpd.points_from_xy(x, y),
            crs=raster.crs,
        )
        boundaries = gpd.read_file(admin)[["KECAMATAN", "DESAKEL", "geometry"]]
        boundaries = boundaries.to_crs(raster.crs)
        joined = gpd.sjoin(points, boundaries, predicate="within", how="left")
        if len(joined) != len(points):
            raise ValueError("Overlapping administrative polygons cause duplicate assignments")

        inside = joined.dropna(subset=["KECAMATAN"])
        by_unit = inside.groupby(["KECAMATAN", "DESAKEL"], as_index=False).agg(
            positive_pixel_centers=("area_ha", "size"),
            geodesic_area_ha=("area_ha", "sum"),
        )
        full = boundaries[["KECAMATAN", "DESAKEL"]].merge(
            by_unit, how="left", on=["KECAMATAN", "DESAKEL"]
        ).fillna({"positive_pixel_centers": 0, "geodesic_area_ha": 0})
        full.positive_pixel_centers = full.positive_pixel_centers.astype(int)
        full.sort_values(["KECAMATAN", "DESAKEL"]).to_csv(out, index=False)
        print("All positive pixels:", len(points))
        print("Positive pixel centres inside polygons:", len(inside))
        print("Geodesic all-positive-pixel area ha:", float(areas.sum()))
        print("Geodesic area from centres inside polygons ha:", float(inside.area_ha.sum()))
        print("Positive centre-based administrative units:",
              int((full.geodesic_area_ha > 0).sum()))
        print("Administrative units:", len(full))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--tif", type=Path, required=True)
    parser.add_argument("--admin", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    calculate(args.tif, args.admin, args.out)
