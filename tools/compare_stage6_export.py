#!/usr/bin/env python3
"""Compare a new Stage 6 GEE CSV export against the locked 304-unit GeoDa vector archive.

Does not interact with GEE. Run AFTER the real GEE export has completed.
Fail if any village differs by more than tolerance even if regional totals match.
"""
import argparse
from pathlib import Path
import geopandas as gpd
import pandas as pd


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--new-stage6-csv',type=Path,required=True)
    p.add_argument('--reference-admin304',type=Path,required=True)
    p.add_argument('--tolerance-ha',type=float,default=0.0001)
    p.add_argument('--results-csv',type=Path,default=Path('stage6_village_comparison.csv'))
    a=p.parse_args()
    ref=gpd.read_file('zip://'+str(a.reference_admin304.resolve())).drop(columns=['geometry'])
    new=pd.read_csv(a.new_stage6_csv)
    key=['KECAMATAN','DESAKEL']
    assert set(key+['conv_ha']).issubset(new.columns),f'GEE export missing required attributes {key+["conv_ha"]}'
    ref=ref.rename(columns={'KEC':'KECAMATAN','DESA':'DESAKEL','CONV_HA':'reference_conv_ha'})
    ref=ref[key+['reference_conv_ha']]
    assert len(new)==304 and not new.duplicated(key).any(),'New Stage 6 output must contain 304 unique units'
    assert len(ref)==304 and not ref.duplicated(key).any()
    joined=ref.merge(new[key+['conv_ha']],on=key,how='outer',indicator=True)
    joined['signed_difference_ha']=joined['conv_ha']-joined['reference_conv_ha']
    joined['absolute_difference_ha']=joined['signed_difference_ha'].abs()
    joined['pass']=joined['_merge'].eq('both') & joined['absolute_difference_ha'].le(a.tolerance_ha)
    a.results_csv.parent.mkdir(parents=True,exist_ok=True)
    joined.sort_values('absolute_difference_ha',ascending=False).to_csv(a.results_csv,index=False)
    print('Reference area ha',ref.reference_conv_ha.sum())
    print('New GEE output area ha',new.conv_ha.sum())
    print('Exact joined units',int(joined['_merge'].eq('both').sum()))
    print('Units outside tolerance',int((~joined['pass']).sum()))
    print('Largest difference ha',joined.absolute_difference_ha.max())
    if not joined['pass'].all():
        print(joined.loc[~joined['pass'],key+['reference_conv_ha','conv_ha','signed_difference_ha']].head(20).to_string(index=False))
        raise SystemExit(1)
    print('PASS: new GEE CSV matches locked Stage 6 at village level within tolerance')

if __name__=='__main__':main()