import percentile from "percentile";
import rawDataFromFile from "../assets/asset_data.json"; // Adjust path if needed

export const rawData: RawDataType = rawDataFromFile;

interface YearData {
  USSTHPI_PC1: number;
  CASTHPI_PC1: number;
  NYSTHPI_PC1: number;
  ATNHPIUS41884Q_PC1: number;
  ATNHPIUS35614Q_PC1: number;
  FLSTHPI_PC1: number;
  ATNHPIUS33124Q_PC1: number;
  INFLATION_RATE: number;
  SP_500_INDEX: number;
}

interface RawDataType {
  [year: string]: YearData;
}

interface ChartDataType extends YearData {
  percentile: string;
}

export const processPercentiles = (
  data: RawDataType
): { chartData: ChartDataType[]; dataKeys: string[] } => {
  const target_percentiles = Array.from({ length: 21 }, (_, i) => i * 5);
  const annual_growths: { [asset: string]: number[] } = {};
  for (const year in data) {
    const yearData = rawData[year];
    for (const asset of Object.keys(yearData) as (keyof YearData)[]) {
      if (!annual_growths[asset]) {
        annual_growths[asset] = [];
      }
      annual_growths[asset].push(yearData[asset]);
    }
  }
  const growth_percentiles: {
    [asset: string]: { [percentile: number]: number };
  } = {};
  for (const asset of Object.keys(annual_growths) as (keyof YearData)[]) {
    growth_percentiles[asset] = {};
    const asset_percentiles = percentile(
      target_percentiles,
      annual_growths[asset]
    ) as number[];
    for (let i = 0; i < target_percentiles.length; i++) {
      growth_percentiles[asset][target_percentiles[i]] = asset_percentiles[i];
    }
  }
  const chartData: ChartDataType[] = target_percentiles.map((p) => {
    const result: ChartDataType = { percentile: p.toString() } as ChartDataType;
    for (const asset of Object.keys(annual_growths) as (keyof YearData)[]) {
      result[asset] = growth_percentiles[asset][p];
    }
    return result;
  });
  const dataKeys: string[] = Object.keys(annual_growths);
  return { chartData, dataKeys };
};
