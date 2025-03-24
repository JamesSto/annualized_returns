import json
import csv

# Output needed for each asset:
# Year, nominal return asset 1, nominal return asset 2 ..., inflation rate

# Load the data using the csv module
data = {}
with open('all_housing_percent_change_annual_end_of_period.csv', 'r') as housing_file:
    for row in csv.DictReader(housing_file):
        year = int(row['observation_date'][:4])
        assert(year not in data)
        data[year] = {}
        for key in row:
            if key == 'observation_date':
                continue
            data[year][key] = float(row[key])

# Load the inflation data
with open('CPIAUCSL_PC1.csv', 'r') as inflation_file:
    for row in csv.DictReader(inflation_file):
        year = int(row['observation_date'][:4])
        if year in data:
            data[year]['INFLATION_RATE'] = float(row['CPIAUCSL_PC1'])


# Load the S&P 500 data
with open('stern_asset_growth.csv', 'r') as sp500_file:
    # Skip the first row
    next(sp500_file)
    for row in csv.DictReader(sp500_file):
        year = int(row['Year'])
        if year in data:
            data[year]['SP_500_INDEX'] = float(row['S&P 500 (includes dividends)'].strip('%'))

assert(max(data.keys()) - min(data.keys()) + 1 == len(data))
assert(all(len(v) == len(list(data.values())[0]) for v in data.values()))

# Save the data as a JSON file
with open('../../rent-buy-growth/src/assets/asset_data.json', 'w') as json_file:
    json.dump(data, json_file, indent=2)
