import React from "react";
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
import {
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { getChartDataForParams } from "../utils/GrowthProcessor";
import { ASSET_COLORS, ASSET_NAMES, ASSETS } from "../utils/Constants";

const GrowthChart: React.FC = () => {

  const customTooltipFormatter = (
    value: ValueType
  ): string | React.ReactNode => {
    if (typeof value === "number") {
      return `${value.toFixed(2)}%`;
    }
    return "N/A";
  };

  const chartData = getChartDataForParams(
    [ASSETS.SP_500_INDEX, ASSETS.USSTHPI_PC1],
    20,
  );

  if (!chartData || chartData.length === 0) {
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
            dataKey="percentile"
            tickFormatter={(tickValue) => `${tickValue}%`}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
            tickLine={false} // Hide tick lines for cleaner look
            axisLine={true} // Show axis line (styled in CSS)
            // Removed inline tick styling
          >
            <Label
              value="Growth Percentile"
              dy={20}
              style={{ textAnchor: "middle" }} // Keep textAnchor if needed
            />
            </XAxis>
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
          {Object.keys(ASSETS).map((key: string) => (
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
