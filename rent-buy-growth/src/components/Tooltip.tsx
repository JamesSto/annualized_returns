import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  number: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, number }) => {
  return (
    <span className={styles.tooltipContainer}>
      <sup className={styles.tooltipTrigger}>[{number}]</sup>
      <span className={styles.tooltipContent}>{content}</span>
    </span>
  );
};

export default Tooltip;
