import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys

RETURN_PERIOD = 5

COLUMNS = {
    'USSTHPI' : "US Home Price Index", 
    'CASTHPI' : "CA Home Price Index", 
    'ATNHPIUS41940Q' : "San Jose-Sunnyvale-Santa Clara Home Price Index", 
    'ATNHPIUS41884Q' : "San Francisco-San Mateo-Redwood City Home Price Index",
    'SFXRCSA' : "San Francisco Condo Price Index",
    'SP500_INDEX' : "S&P 500 Index"
}

# Load the data from the uploaded files
home_price_index_us = pd.read_csv('data/Annual US Home Price Index.csv')
home_price_index_ca = pd.read_csv('data/Annual California Home Price Index.csv')
home_price_index_sj = pd.read_csv('data/San Jose-Sunnyvale-Santa Clara Area Home Price Index.csv')
home_price_index_sf = pd.read_csv('data/San Francisco-San Mateo-Redwood City Home Price Index.csv')
condo_price_index_sf = pd.read_csv('data/San Francisco Condo Price Index.csv')
inflation_rate = pd.read_csv('data/US Annual Inflation Rate.csv')
sp500_returns = pd.read_csv('data/S&P 500 Annual Return (Nominal).csv')
# apple_values = pd.read_csv('data/apple_stock.csv')
# google_values = pd.read_csv('data/google_stock.csv')

# Convert DATE columns to datetime objects for proper alignment
home_price_index_us['DATE'] = pd.to_datetime(home_price_index_us['DATE'])
home_price_index_ca['DATE'] = pd.to_datetime(home_price_index_ca['DATE'])
home_price_index_sj['DATE'] = pd.to_datetime(home_price_index_sj['DATE'])
home_price_index_sf['DATE'] = pd.to_datetime(home_price_index_sf['DATE'])
condo_price_index_sf['DATE'] = pd.to_datetime(condo_price_index_sf['DATE'])
inflation_rate['DATE'] = pd.to_datetime(inflation_rate['DATE'])
# apple_values['DATE'] = pd.to_datetime(apple_values['DATE'])
# google_values['DATE'] = pd.to_datetime(google_values['DATE'])

# Extract the year from DATE columns for easier merging
home_price_index_us['YEAR'] = home_price_index_us['DATE'].dt.year
home_price_index_ca['YEAR'] = home_price_index_ca['DATE'].dt.year
home_price_index_sj['YEAR'] = home_price_index_sj['DATE'].dt.year
home_price_index_sf['YEAR'] = home_price_index_sf['DATE'].dt.year
condo_price_index_sf['YEAR'] = condo_price_index_sf['DATE'].dt.year
inflation_rate['YEAR'] = inflation_rate['DATE'].dt.year
# apple_values['YEAR'] = apple_values['DATE'].dt.year
# google_values['YEAR'] = google_values['DATE'].dt.year

# Merge the datasets on YEAR
data_merged = pd.merge(home_price_index_us[['YEAR', 'USSTHPI']], home_price_index_ca[['YEAR', 'CASTHPI']], on='YEAR', how='inner')
data_merged = pd.merge(data_merged, home_price_index_sj[['YEAR', 'ATNHPIUS41940Q']], on='YEAR', how='inner')
data_merged = pd.merge(data_merged, home_price_index_sf[['YEAR', 'ATNHPIUS41884Q']], on='YEAR', how='inner')
data_merged = pd.merge(data_merged, condo_price_index_sf[['YEAR', 'SFXRCSA']], on='YEAR', how='inner')
data_merged = pd.merge(data_merged, inflation_rate[['YEAR', 'INFLATION_RATE']], on='YEAR', how='inner')
# data_merged = pd.merge(data_merged, apple_values[['YEAR', 'APPLE_PRICE']], on='YEAR', how='inner')
# data_merged = pd.merge(data_merged, google_values[['YEAR', 'GOOGLE_PRICE']], on='YEAR', how='inner')
data_merged = pd.merge(data_merged, sp500_returns, on='YEAR', how='inner')

# Sort the merged data by YEAR to facilitate further analysis
data_merged = data_merged.sort_values(by='YEAR')

# Convert S&P 500 returns to index values, starting from 100
curr = 100
for i in range(len(data_merged)):
    data_merged.loc[i, "SP500_INDEX"] = curr * (1 + data_merged.loc[i, 'RETURN']/100.0)
    curr = data_merged.loc[i, "SP500_INDEX"]

print(data_merged.head(15))

# Adjust all data for inflation
running_inflation_rate = 1
for i in range(len(data_merged)):
    running_inflation_rate *= 1 + (data_merged.loc[i, 'INFLATION_RATE'] / 100)
    for col in COLUMNS.keys():
        data_merged.loc[i, col] /= running_inflation_rate

print(data_merged.head(15))

def cagr(data, row_name, start, end):
    return (data.loc[end, row_name] / data.loc[start, row_name])**(1/(end-start)) - 1

start = 0
rows = []
while start + RETURN_PERIOD < len(data_merged):
    assert(data_merged.loc[start, "YEAR"] == data_merged.loc[start + RETURN_PERIOD, "YEAR"] - RETURN_PERIOD)
    rows.append(
        [data_merged.loc[start + RETURN_PERIOD, "YEAR"]] + 
        [cagr(data_merged, col, start, start + RETURN_PERIOD) for col in COLUMNS.keys()]
    )
    start += 1

cagrs = pd.DataFrame(rows, columns=['Year'] + list(COLUMNS.keys()))

quantiles = []

for quantile in range(101):
    q = quantile/100
    quantiles.append([q] + [cagrs[col].quantile(q) for col in COLUMNS.keys()])

quant_frame = pd.DataFrame(quantiles, columns=['quantile'] + list(COLUMNS.keys()))

plt.figure(figsize=(10, 6))

# Plot each series against the quantiles
for col, label in COLUMNS.items():
    plt.plot('quantile', col, data=quant_frame, label=label)

# Customize the plot
plt.xlabel('Percentile')
plt.ylabel('Real Annual Return')
plt.title(f'{RETURN_PERIOD} year real annualized return since {data_merged.loc[0, "YEAR"]} percentiles')
plt.legend()

# Show the plot
plt.show()