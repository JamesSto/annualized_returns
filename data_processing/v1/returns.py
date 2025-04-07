import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys
import os

RETURN_PERIOD = 20
START_DATE = 1976
START_DATE = max(START_DATE, 1976) # Earliest the data goes back is 1976
END_DATE = 2025
ADJUST_FOR_INFLATION = False

TO_SKIP = [
    "S&P 500 Annual Return (Nominal).csv",
    "San Francisco Condo Price Index.csv",
    "San Jose-Sunnyvale-Santa Clara Area Home Price Index.csv",
    "San Francisco-San Mateo-Redwood City Home Price Index.csv",
    "Annual California Home Price Index.csv"
    # "Annual US Home Price Index.csv"
]

COLUMNS = {}

data_merged = None

for filename in os.listdir("data"):
    if filename in TO_SKIP:
        continue
    new_data = pd.read_csv("data/" + filename)
    new_data['DATE'] = pd.to_datetime(new_data['DATE'])
    new_data['YEAR'] = new_data['DATE'].dt.year
    if data_merged is None:
        data_merged = new_data
    else:
        data_merged = pd.merge(data_merged, new_data[['YEAR', new_data.columns[1]]], on='YEAR', how='inner')
    
    if new_data.columns[1] != 'INFLATION_RATE':
        COLUMNS[new_data.columns[1]] = filename[:-4]

print(COLUMNS)

# Load the data from the uploaded files
if 'S&P 500 Annual Return (Nominal).csv' not in TO_SKIP:
    sp500_returns = pd.read_csv('data/S&P 500 Annual Return (Nominal).csv')
    data_merged = pd.merge(data_merged, sp500_returns, on='YEAR', how='inner')

# Sort the merged data by YEAR to facilitate further analysis
data_merged = data_merged.sort_values(by='YEAR').reset_index(drop=True)

if 'S&P 500 Annual Return (Nominal).csv' not in TO_SKIP:
    # Convert S&P 500 returns to index values, starting from 100
    curr = 100
    for i in range(len(data_merged)):
        data_merged.loc[i, "SP500_INDEX"] = curr * (1 + data_merged.loc[i, 'RETURN']/100.0)
        curr = data_merged.loc[i, "SP500_INDEX"]

    COLUMNS["SP500_INDEX"] = "S&P 500 Index"

# Adjust all data for inflation
if ADJUST_FOR_INFLATION:
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
cagrs = cagrs[cagrs['Year'] >= START_DATE + RETURN_PERIOD]
cagrs = cagrs[cagrs['Year'] <= END_DATE]
print(cagrs.head(5))
print(cagrs.tail(5))

quantiles = []

for quantile in range(101):
    q = quantile/100
    quantiles.append([q] + [cagrs[col].quantile(q) for col in COLUMNS.keys()])

for q in quantiles:
    print(q)

quant_frame = pd.DataFrame(quantiles, columns=['quantile'] + list(COLUMNS.keys()))

plt.figure(figsize=(10, 6))

# Plot each series against the quantiles
for col, label in COLUMNS.items():
    plt.plot('quantile', col, data=quant_frame, label=label)

# Customize the plot
plt.xlabel('Percentile')
plt.ylabel('Real Annual Return' if ADJUST_FOR_INFLATION else 'Nominal Annual Return')
plt.title(f'{RETURN_PERIOD} year {"real" if ADJUST_FOR_INFLATION else "nominal"} annualized return since {START_DATE} percentiles')
plt.legend()

# Show the plot
plt.show()
