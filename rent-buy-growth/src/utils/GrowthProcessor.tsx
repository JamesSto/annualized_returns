import { ASSETS } from "./Constants";
import percentile from "percentile";
import rawDataFromFile from "../assets/asset_data.json";

interface YearData extends Record<ASSETS, number> {
  INFLATION_RATE: number;
}

export const rawData: RawDataType = rawDataFromFile;

interface ChartDataType extends Record<ASSETS, number> {
  percentile: number;
}

interface RawDataType {
  [year: string]: YearData;
}

export const getChartDataForParams = (
  assets: ASSETS[],
  periodSize: number,
  adjustForInflation?: boolean,
  startYear?: number,
  endYear?: number
): ChartDataType[] => {
  const processedData = new Map(
    Object.entries(rawData).filter(([year]) => {
      const numericYear = Number(year);
      return (
        (startYear === undefined || numericYear >= startYear) &&
        (endYear === undefined || numericYear <= endYear)
      );
    })
  );

  let assetDataByYear = new Map(
    Array.from(processedData.entries()).map(([year, dataByAsset]) => [
      year,
      new Map(
        Object.entries(dataByAsset).filter(
          ([asset]) =>
            asset !== "INFLATION_RATE" && assets.includes(asset as ASSETS)
        ) as [ASSETS, number][]
      ),
    ])
  );

  if (adjustForInflation) {
    const inflationByYear = new Map(
      Array.from(processedData.entries()).map(([year, dataByAsset]) => [
        year,
        dataByAsset["INFLATION_RATE"]
      ])
    );
    assetDataByYear = adjustGrowthForInflation(assetDataByYear, inflationByYear)
  }
  const percentileData = calculateAnnualizedPeriodGrowths(
    assetDataByYear,
    periodSize
  );
  const chartData = processPercentiles(percentileData);
  return chartData;
};

/**
 * Takes in the growth values for each year and converts it to a list of growth percentiles.
 *
 * The input to this may be "annualized growth the twenty years preceding this given year' or similar.
 */
function processPercentiles(
  dataByYear: Map<string, Map<ASSETS, number>>
): ChartDataType[] {
  const target_percentiles = Array.from({ length: 21 }, (_, i) => i * 5);
  const annual_growths: Map<ASSETS, number[]> = new Map();
  for (const [, growthByAsset] of dataByYear) {
    for (const [asset, value] of growthByAsset) {
      if (!annual_growths.has(asset)) {
        annual_growths.set(asset, []);
      }
      annual_growths.get(asset)!.push(value);
    }
  }
  const growth_percentiles: Map<ASSETS, Map<number, number>> = new Map();
  for (const asset of annual_growths.keys()) {
    growth_percentiles.set(asset, new Map());
    const asset_percentiles = percentile(
      target_percentiles,
      annual_growths.get(asset)!
    ) as number[];
    for (let i = 0; i < target_percentiles.length; i++) {
      growth_percentiles
        .get(asset)!
        .set(target_percentiles[i], asset_percentiles[i]);
    }
  }
  const chartData: ChartDataType[] = target_percentiles.map((p) => {
    const result: ChartDataType = {
      percentile: p,
    } as ChartDataType;

    for (const asset of annual_growths.keys()) {
      result[asset] = growth_percentiles.get(asset)!.get(p)!;
    }

    return result;
  });
  return chartData;
}

/**
 * Given the input Map<Year, Map<Assets, growthForThatYear>>, calculates the annualized percentage growth for each
 * period of size periodSize, and returns the same map where the years are the END year of each period.
 */
function calculateAnnualizedPeriodGrowths(
  dataByYear: Map<string, Map<ASSETS, number>>,
  periodSize: number
): Map<string, Map<ASSETS, number>> {
  const annualizedGrowths: Map<string, Map<ASSETS, number>> = new Map();

  // Validate periodSize
  if (periodSize <= 0) {
    console.warn("periodSize must be greater than 0.");
    throw new Error("periodSize must be greater than 0.");
  }

  // Get and sort the years available in the data
  const sortedYears = Array.from(dataByYear.keys()).sort();

  // Need at least 'periodSize' years of data to calculate the first period
  if (sortedYears.length < periodSize) {
    throw new Error("periodSize is larger than data time period");
  }

  // Iterate through potential end years for the periods
  // The first possible end year is the (periodSize - 1)-th index in the sorted array
  for (let i = periodSize - 1; i < sortedYears.length; i++) {
    const endYear = sortedYears[i];
    const startYearIndex = i - periodSize + 1;
    const periodYears = sortedYears.slice(startYearIndex, i + 1); // Get the years for the current period

    const endYearData = dataByYear.get(endYear);
    if (!endYearData) throw new Error("End year didn't exist"); // Should not happen if years are from keys, but good practice
    if (
      parseInt(endYear) - parseInt(sortedYears[startYearIndex]) !=
      i - startYearIndex
    )
      throw new Error("Years are not consecutive");

    const periodResultsForAssets: Map<ASSETS, number> = new Map();

    // Iterate through assets present in the *end year* of the period
    // We only calculate if an asset has data for ALL years in the period
    for (const asset of endYearData.keys()) {
      let productOfGrowthFactors = 1.0;
      let dataAvailableForAllYears = true;

      // Check and accumulate growth for this asset across all years in the period
      for (const year of periodYears) {
        const yearData = dataByYear.get(year);
        const yearlyGrowth = yearData!.get(asset)! / 100.0; // Percentage growth for the year

        // If data for this asset is missing in any year of the period, skip calculation for this asset
        if (yearlyGrowth === undefined || yearlyGrowth === null) {
          dataAvailableForAllYears = false;
          break;
        }

        // Convert percentage growth (e.g., 0.1) to growth factor (e.g., 1.1) and multiply
        productOfGrowthFactors *= 1 + yearlyGrowth;
      }

      // If data was present for all years, calculate and store the annualized growth
      if (dataAvailableForAllYears) {
        // Calculate annualized growth: (Product of factors)^(1 / periodSize) - 1
        // Handle potential negative productOfGrowthFactors if values can be very negative
        // (though growth rates typically don't result in negative total factors unless > -100% loss)
        let annualizedGrowth: number;
        if (productOfGrowthFactors < 0 && periodSize % 2 === 0) {
          // Cannot take an even root of a negative number in real numbers
          // This implies losing more than 100% cumulatively, which is unusual for standard growth %
          console.warn(
            `Cannot calculate real annualized growth for asset ${asset} ending ${endYear} due to negative cumulative factor and even period size.`
          );
          throw new Error(
            `Cannot calculate real annualized growth for asset ${asset} ending ${endYear} due to negative cumulative factor and even period size.`
          );
        } else {
          // Calculate the annualized growth factor using Math.pow
          // Use Math.sign for negative bases if necessary (though less common for growth factors)
          const annualizedGrowthFactor =
            Math.sign(productOfGrowthFactors) *
            Math.pow(Math.abs(productOfGrowthFactors), 1 / periodSize);
          // Convert back to percentage growth
          annualizedGrowth = annualizedGrowthFactor - 1;
        }
        periodResultsForAssets.set(asset, annualizedGrowth * 100.0);
      } else {
        throw new Error("Data not available for all years");
      }
    }

    // If any results were calculated for this end year, add them to the main map
    if (periodResultsForAssets.size > 0) {
      annualizedGrowths.set(endYear, periodResultsForAssets);
    }
  }
  return annualizedGrowths;
}

/**
 * Given the input Map<Year, Map<Assets, growthForThatYear>>, adjusts all the growths for inflation
 */
function adjustGrowthForInflation(
  dataByYear: Map<string, Map<ASSETS, number>>,
  inflationByYear: Map<string, number>
): Map<string, Map<ASSETS, number>> {
  const result = new Map<string, Map<ASSETS, number>>();
  for (const [year, dataByAsset] of dataByYear.entries()) {
    const inflation = inflationByYear.get(year)!; 
    const newAssetMap = new Map<ASSETS, number>();
    for (const [asset, growth] of dataByAsset.entries()) {
      const adjustedGrowth = ((100.0 + growth) / (100.0 + inflation) - 1.0) * 100.0;
      newAssetMap.set(asset, adjustedGrowth);
    }
    result.set(year, newAssetMap);
  }
  return result;
}
