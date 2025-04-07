import { ASSETS } from "./Constants"
import percentile from "percentile";
import rawDataFromFile from "../assets/asset_data.json"

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

/**
 * Takes in the growth values for each year and converts it to a list of growth percentiles.
 * 
 * The input to this may be "annualized growth the twenty years preceding this given year' or similar.
 */
export const processPercentiles = (
  dataByYear: Map<string, Map<ASSETS, number>>
): { chartData: ChartDataType[] } => {
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
      growth_percentiles.get(asset)!.set(target_percentiles[i], asset_percentiles[i]);
    }
  }
  const chartData: ChartDataType[] = target_percentiles.map((p) => {
    const result: ChartDataType = {
      percentile: p
    } as ChartDataType;
    
    for (const asset of annual_growths.keys()) {
      result[asset] = growth_percentiles.get(asset)!.get(p)!;
    }
    
    return result;
  });
  return { chartData };
};
