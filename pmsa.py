import pandas as pd
import streamlit as st

xls = pd.ExcelFile('pmsa_india_regridded-popwt.xlsm')
pmsa_clubbed = pd.read_excel(xls, 'pmsa_clubbed').iloc[:,:12]
grids = pd.read_csv('grids_districts.csv')

pmsa_clubbed = pmsa_clubbed.merge(grids, left_on=['Longitude', 'Latitude'], right_on=['Maille_X', 'Maille_Y'])

print(pmsa_clubbed.head())
