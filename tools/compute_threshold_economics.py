#!/usr/bin/env python3
"""Calculate threshold-specific production and monetary figures only when the
Stage 7 POST-PATCH village export exists and per-village rice intensity is known.
Only historic 230 conversion villages have a verified RICE_INT parameter.
If a new threshold includes other villages, stop instead of imputing silently.
"""
import argparse
from pathlib import Path
import pandas as pd
import numpy as np

def run(stage7,ref,price,tolerance):
    cols=['KECAMATAN','DESAKEL','area_T50_ha','area_T60_ha','area_T70_ha']
    missing=set(cols)-set(stage7.columns)
    if missing:raise ValueError(f'Stage 7 missing expected columns: {sorted(missing)}')
    stage7=stage7[cols].copy()
    if len(stage7)!=304 or stage7.duplicated(['KECAMATAN','DESAKEL']).any():
        raise ValueError('Stage 7 must contain 304 unique administrative units')
    base=ref.rename(columns={'KEC':'KECAMATAN','DESA':'DESAKEL'})
    j=base.merge(stage7,on=['KECAMATAN','DESAKEL'],how='outer',validate='one_to_one',indicator=True)
    if len(j)!=304 or not (j._merge=='both').all():
        raise ValueError('Stage 7 administrative unit matching fails')
    j['T60_diff_ha']=j.area_T60_ha-j.CONV_HA
    if j.T60_diff_ha.abs().max()>tolerance:
        raise ValueError(f'Stage 7 T60 does not reconcile with archived Stage 6. max delta {j.T60_diff_ha.abs().max():.6f} ha')
    # 74 previously zero-conversion villages lack verified conversion-intensity params.
    for t in [50,60,70]:
        mask=j[f'area_T{t}_ha'].gt(1e-9) & j.CONV_HA.le(1e-9)
        if mask.any():
            names=j.loc[mask,['KECAMATAN','DESAKEL',f'area_T{t}_ha']]
            raise ValueError(f'T{t} includes {mask.sum()} villages outside the locked 230-unit modelling universe. '
                'Provide approved CI-derived production coefficients before district totals. First rows: '
                +names.head(10).to_string(index=False))
        j[f'rice_T{t}_t_per_year']=j[f'area_T{t}_ha']*j.RICE_INT
        j[f'value_T{t}_rp_per_year']=j[f'rice_T{t}_t_per_year']*1000*price
    summary=[]
    for t in [50,60,70]:
        summary.append({'built_threshold':t/100,
           'post_patch_conversion_area_ha':j[f'area_T{t}_ha'].sum(),
           'foregone_rice_t_per_year':j[f'rice_T{t}_t_per_year'].sum(),
           'gross_output_value_rp_per_year':j[f'value_T{t}_rp_per_year'].sum(),
           'method':'Historic RICE_INT coefficient held fixed, 304-area reconciliation required'})
    return j,pd.DataFrame(summary)

def main():
    p=argparse.ArgumentParser();p.add_argument('--stage7-csv',type=Path,required=True)
    p.add_argument('--stage6-archived-csv',type=Path,default=Path('data_reference/Stage6_archived_304_units.csv'))
    p.add_argument('--price-rp-per-kg',type=float,default=12984.92)
    p.add_argument('--tolerance-ha',type=float,default=0.001)
    p.add_argument('--output-dir',type=Path,default=Path('results/thresholds'))
    a=p.parse_args()
    j,s=run(pd.read_csv(a.stage7_csv),pd.read_csv(a.stage6_archived_csv),a.price_rp_per_kg,a.tolerance_ha)
    a.output_dir.mkdir(parents=True,exist_ok=True)
    j.to_csv(a.output_dir/'threshold_village_results.csv',index=False)
    s.to_csv(a.output_dir/'threshold_totals.csv',index=False)
    print(s.to_string(index=False))
if __name__=='__main__': main()