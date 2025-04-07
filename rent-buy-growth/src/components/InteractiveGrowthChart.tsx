import React, { useState } from "react";
import GrowthChart from "./GrowthChart";
import styles from "./GrowthChart.module.css";
import { ASSETS, ASSET_NAMES } from "../utils/Constants";

const InteractiveGrowthChart: React.FC = () => {
  // State for all the customizable parameters
  const [selectedAssets, setSelectedAssets] = useState<ASSETS[]>([
    ASSETS.SP_500_INDEX,
    ASSETS.USSTHPI_PC1,
  ]);
  const [periodSize, setPeriodSize] = useState<number>(20);
  const [startYear, setStartYear] = useState<number>(1977);
  const [endYear, setEndYear] = useState<number>(2024);

  // Handle asset selection
  const handleAssetToggle = (asset: ASSETS) => {
    if (selectedAssets.includes(asset)) {
      setSelectedAssets(selectedAssets.filter((a) => a !== asset));
    } else {
      setSelectedAssets([...selectedAssets, asset]);
    }
  };

  // Handle period size change
  const handlePeriodSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPeriodSize(value);
    }
  };

  // Handle year range changes
  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setStartYear(value);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setEndYear(value);
    }
  };

  // Validate years on blur
  const handleStartYearBlur = () => {
    if (startYear < 1977) {
      setStartYear(1977);
    } else if (startYear >= endYear) {
      setStartYear(endYear - 1);
    }
  };

  const handleEndYearBlur = () => {
    if (endYear > 2024) {
      setEndYear(2024);
    } else if (endYear <= startYear) {
      setEndYear(startYear + 1);
    }
  };

  return (
    <>
      <div>
        <GrowthChart
          assets={selectedAssets}
          periodSize={periodSize}
          startYear={startYear}
          endYear={endYear}
        />
      </div>
      <div className={styles.controlsContainer}>
        <div className={styles.controlSection}>
          <h3 className={styles.controlTitle}>Show Growth For:</h3>
          <div className={styles.assetControls}>
            {Object.values(ASSETS).map((asset) => (
              <label key={asset} className={styles.assetCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset)}
                  onChange={() => handleAssetToggle(asset)}
                />
                {ASSET_NAMES[asset]}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.controlSection}>
          <div className={styles.horizontalControl}>
            <h3 className={styles.controlTitle}>Over periods of:</h3>
            <div className={styles.rangeControl}>
              <input
                type="range"
                min="1"
                max="48"
                value={periodSize}
                onChange={handlePeriodSizeChange}
                className={styles.slider}
              />
              <span className={styles.rangeValue}>{periodSize} years</span>
            </div>
          </div>
        </div>

        <div className={styles.controlSection}>
          <div className={styles.horizontalControl}>
            <h3 className={styles.controlTitle}>From:</h3>
            <div className={styles.yearControls}>
              <input
                type="number"
                min="1977"
                max={endYear - 1}
                value={startYear}
                onChange={handleStartYearChange}
                onBlur={handleStartYearBlur}
                className={styles.yearInput}
              />
              <span className={styles.yearSeparator}>to</span>
              <input
                type="number"
                min={startYear + 1}
                max="2024"
                value={endYear}
                onChange={handleEndYearChange}
                onBlur={handleEndYearBlur}
                className={styles.yearInput}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveGrowthChart;
