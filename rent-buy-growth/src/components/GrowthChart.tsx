import React, { useState } from "react";
import styles from "./GrowthChart.module.css"; // Adjust path if needed

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
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { getChartDataForParams } from "../utils/GrowthProcessor";
import {
  ASSET_COLORS,
  ASSET_NAMES,
  ASSET_TOOLTIP_TEXTS,
  ASSETS,
  ASSET_LINKS,
} from "../utils/Constants";

// Define the props type
interface GrowthChartProps {
  assets: ASSETS[];
  periodSize: number;
  startYear?: number;
  endYear?: number;
}

// Define types for the Legend component
interface LegendPayloadItem {
  value: string;
  type: string;
  id: string;
  color: string;
  dataKey: string;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// Custom Legend component with tooltips
const CustomLegend: React.FC<CustomLegendProps> = (props) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const { payload = [] } = props;
  console.log(payload);
  return (
    <div className={styles.legendContainer}>
      {payload.map((entry, index) => (
        <a target="_blank" href={ASSET_LINKS[entry.dataKey]}>
          <div key={`item-${index}`} className={styles.legendItem}>
            <span
              className={styles.legendText}
              onMouseEnter={() => setActiveItem(entry.value)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <span
                className={styles.legendMarker}
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ color: entry.color }}>{entry.value}</span>
              <span className={styles.infoIcon} style={{ color: entry.color }}>
                ⓘ
              </span>
            </span>
            {activeItem === entry.value && (
              <div className={styles.legendTooltip}>
                {ASSET_TOOLTIP_TEXTS[entry.dataKey]}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

const GrowthChart: React.FC<GrowthChartProps> = ({
  // Destructure props here
  assets,
  periodSize,
  startYear = 1977,
  endYear = 2024,
}) => {
  // Validate parameters
  const isValidRange = () => {
    if (startYear > endYear) return false;
    if (endYear - startYear < periodSize - 1) return false;
    return true;
  };

  let chartData;
  if (isValidRange()) {
    chartData = getChartDataForParams(assets, periodSize, startYear, endYear);
  } else {
    chartData = getChartDataForParams([], periodSize);
  }

  if (!chartData || chartData.length === 0) {
    return <div>Data file seems empty or invalid. Cannot display chart.</div>;
  }

  const customTooltipFormatter = (
    value: ValueType
  ): string | React.ReactNode => {
    if (typeof value === "number") {
      return `${value.toFixed(2)}%`;
    }
    return "N/A";
  };

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>
        Annualized Growth for Every {periodSize} Year Period {startYear ?? 1977} -{" "}
        {endYear ?? 2024}
      </h2>
      <ResponsiveContainer 
        width="100%" 
        height={window?.innerWidth < 768 ? 400 : 500}
      >
        <LineChart
          data={chartData}
          margin={{ 
            right: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="percentile"
            tickFormatter={(tickValue) => `${tickValue}%`}
            angle={-45}
            textAnchor="end"
            height={window?.innerWidth < 768 ? 60 : 50}
            interval={window?.innerWidth < 768 ? 1 : "preserveStartEnd"}
            tickLine={false}
            axisLine={true}
            fontSize={window?.innerWidth < 768 ? 10 : 12}
          >
            <Label
              value="Growth Percentile"
              dy={window?.innerWidth < 768 ? 30 : 25}
              style={{ textAnchor: "middle", fontSize: window?.innerWidth < 768 ? "0.8rem" : "1rem" }}
            />
          </XAxis>
          <YAxis 
            tickLine={false} 
            axisLine={true}
            fontSize={window?.innerWidth < 768 ? 10 : 12}
          >
            <Label
              value="Nominal Growth %"
              angle={-90}
              dx={10}
              position="insideLeft"
              style={{ 
                textAnchor: "middle", 
                fontSize: window?.innerWidth < 768 ? "0.8rem" : "1rem"
              }}
            />
          </YAxis>

          <Tooltip
            formatter={customTooltipFormatter}
            cursor={{ stroke: "#aaa", strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "rgba(40, 45, 60, 0.85)",
              borderColor: "#666",
              borderRadius: "4px",
              color: "#f1f1f1",
              fontSize: "13px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            }}
            labelStyle={{
              color: "#ffffff",
              fontWeight: "bold",
            }}
            itemStyle={{ paddingTop: "2px", paddingBottom: "2px" }}
          />

          <Legend
            verticalAlign="top"
            content={<CustomLegend />}
          />

          {Object.values(isValidRange() ? assets : []).map((key: string) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={ASSET_COLORS[key]}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }}
              dot={false}
              name={ASSET_NAMES[key]}
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
