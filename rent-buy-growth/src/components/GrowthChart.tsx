import React from "react";
import percentile from "percentile";
import styles from "./GrowthChart.module.css"; // Adjust path if needed
import rawDataFromFile from "../assets/asset_data.json"; // Adjust path if needed

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const ASSET_COLORS: Record<string, string> = {
    USSTHPI_PC1: "#FF6B6B",      // Bright coral red
    CASTHPI_PC1: "#4ECDC4",      // Bright turquoise
    NYSTHPI_PC1: "#FFE66D",      // Bright yellow
    ATNHPIUS41884Q_PC1: "#FF8C42", // Bright orange
    ATNHPIUS35614Q_PC1: "#9B59B6", // Purple
    ATNHPIUS33124Q_PC1: "#96F550", // Lime green
    FLSTHPI_PC1: "#FF69B4",      // Hot pink
    INFLATION_RATE: "#B388FF",    // Bright purple
    SP_500_INDEX: "#2ECC71",      // Emerald green
};

const ASSET_NAMES: Record<string, string> = {
  USSTHPI_PC1: "US Homes",
  CASTHPI_PC1: "California Homes",
  NYSTHPI_PC1: "NY State Homes",
  ATNHPIUS41884Q_PC1: "SF Homes",
  ATNHPIUS35614Q_PC1: "NYC Homes",
  ATNHPIUS33124Q_PC1: "Miami Homes",
  FLSTHPI_PC1: "FL Homes",
  INFLATION_RATE: "Inflation",
  SP_500_INDEX: "S&P 500",
};

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

const rawData: RawDataType = rawDataFromFile;

const processPercentiles = (
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
    const asset_percentiles: number[] = percentile(
      target_percentiles,
      annual_growths[asset]
    );
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

const GrowthChart: React.FC = () => {
  const { chartData, dataKeys } = processPercentiles(rawData);

  const customTooltipFormatter = (
    value: ValueType,
    name: NameType,
    props: TooltipProps<ValueType, NameType>
  ): string | React.ReactNode => {
    if (typeof value === "number") {
      return `${value.toFixed(2)}%`;
    }
    return "N/A";
  };

  if (!chartData || chartData.length === 0 || dataKeys.length === 0) {
    return <div>Data file seems empty or invalid. Cannot display chart.</div>;
  }

  return (
    // --- Apply CSS Module class to container ---
    <div className={styles.chartContainer}>
      {/* --- Apply CSS Module class to title --- */}
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5, // Reduced top margin as title has margin
            right: 30, // Adjusted margins slightly
            left: 20,
            bottom: 35, // Keep space for angled labels
          }}
        >
          {/* Grid lines are styled via CSS */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Axes ticks/lines/labels styled via CSS */}
          <XAxis
            dataKey="year"
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
            tickLine={false} // Hide tick lines for cleaner look
            axisLine={true} // Show axis line (styled in CSS)
            // Removed inline tick styling
          />
          <YAxis
            tickLine={false} // Hide tick lines
            axisLine={true} // Show axis line (styled in CSS)
            // Removed inline tick styling
          >
            {/* Label styled via CSS, but position props remain */}
            <Label
              value="Growth (%)"
              angle={-90}
              position="insideLeft"
              // Removed inline style prop
              style={{ textAnchor: "middle" }} // Keep textAnchor if needed
            />
          </YAxis>

          {/* Tooltip: Style background/text via props for reliability */}
          <Tooltip
            formatter={customTooltipFormatter}
            cursor={{ stroke: "#aaa", strokeDasharray: "3 3" }} // Style hover cursor line
            contentStyle={{
              // Styles for the tooltip box itself
              backgroundColor: "rgba(40, 45, 60, 0.85)", // Slightly transparent dark background
              borderColor: "#666",
              borderRadius: "4px",
              color: "#f1f1f1", // Ensure text color is light
              fontSize: "13px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)", // Optional shadow
            }}
            labelStyle={{
              color: "#ffffff",
              fontWeight: "bold",
              marginBottom: "5px",
            }} // Style the year label
            itemStyle={{ paddingTop: "2px", paddingBottom: "2px" }} // Spacing for items
          />

          {/* Legend styled via CSS */}
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "20px" }}
          />

          {/* Lines updated to use asset mappings */}
          {dataKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={ASSET_COLORS[key]}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }}
              dot={false}
              name={ASSET_NAMES[key]} // Use human-readable name here
              connectNulls={true}
              strokeWidth={1.5}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
