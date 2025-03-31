import React from 'react';
// --- Import CSS Module ---
import styles from './GrowthChart.module.css'; // Adjust path if needed

// Import the JSON data directly
import rawDataFromFile from '../assets/asset_data.json'; // Adjust path if needed

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
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


// --- TypeScript Interfaces remain the same ---
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
    year: string;
}

const rawData: RawDataType = rawDataFromFile;

// Helper Function remains the same
const processData = (data: RawDataType): { chartData: ChartDataType[]; dataKeys: string[] } => {
  const years = Object.keys(data).sort();
  const chartData: ChartDataType[] = years.map(year => ({
    year: year,
    ...data[year]
  }));
  const dataKeys: string[] = years.length > 0 && data[years[0]]
                             ? Object.keys(data[years[0]])
                             : [];
  return { chartData, dataKeys };
};

const COLORS: string[] = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE',
  '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0'
];

const GrowthChart: React.FC = () => {
  const { chartData, dataKeys } = processData(rawData);

  // Typed Tooltip Formatter remains the same
  const customTooltipFormatter = (
      value: ValueType,
      name: NameType,
      props: TooltipProps<ValueType, NameType>
   ): string | React.ReactNode => {
     if (typeof value === 'number') {
        return `${value.toFixed(2)}%`;
     }
     return 'N/A';
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
                style={{ textAnchor: 'middle' }} // Keep textAnchor if needed
              />
          </YAxis>

          {/* Tooltip: Style background/text via props for reliability */}
          <Tooltip
            formatter={customTooltipFormatter}
            cursor={{ stroke: '#aaa', strokeDasharray: '3 3' }} // Style hover cursor line
            contentStyle={{ // Styles for the tooltip box itself
                backgroundColor: 'rgba(40, 45, 60, 0.85)', // Slightly transparent dark background
                borderColor: '#666',
                borderRadius: '4px',
                color: '#f1f1f1', // Ensure text color is light
                fontSize: '13px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)' // Optional shadow
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }} // Style the year label
            itemStyle={{ paddingTop: '2px', paddingBottom: '2px'}} // Spacing for items
          />

          {/* Legend styled via CSS */}
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />

          {/* Lines remain the same */}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 1 }} // Enhanced active dot
              dot={false}
              name={key}
              connectNulls={true}
              strokeWidth={1.5} // Slightly thinner lines can look good
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
