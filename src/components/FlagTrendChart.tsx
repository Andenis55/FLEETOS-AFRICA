import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Driver } from '../data/drivers';
import { parseISO } from 'date-fns';
import { getISOWeek, getYear } from 'date-fns';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  drivers: Driver[];
};

const FlagTrendChart: React.FC<Props> = ({ drivers }) => {
  const weekMap = new Map<string, { block: number; caution: number; none: number }>();

  drivers.forEach((driver) => {
    (driver.history ?? []).forEach((entry) => {
      const date = parseISO(entry.date);
      const year = getYear(date);
      const week = getISOWeek(date);
      const key = `${year}-W${String(week).padStart(2, '0')}`;
      if (!weekMap.has(key)) {
        weekMap.set(key, { block: 0, caution: 0, none: 0 });
      }
      const record = weekMap.get(key)!;
      record[entry.value ?? 'none'] += 1;
    });
  });

  const sortedWeeks = Array.from(weekMap.keys()).sort();

  const data = {
    labels: sortedWeeks,
    datasets: [
      {
        label: '🚫 Blocked',
        data: sortedWeeks.map((k) => weekMap.get(k)?.block ?? 0),
        fill: false,
        borderColor: '#ef4444',
        backgroundColor: '#ef444488',
        tension: 0.3,
      },
      {
        label: '⚠️ Caution',
        data: sortedWeeks.map((k) => weekMap.get(k)?.caution ?? 0),
        fill: false,
        borderColor: '#facc15',
        backgroundColor: '#facc1588',
        tension: 0.3,
      },
      {
        label: '✅ Clear',
        data: sortedWeeks.map((k) => weekMap.get(k)?.none ?? 0),
        fill: false,
        borderColor: '#22c55e',
        backgroundColor: '#22c55e88',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-4 mt-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Flag Changes Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default FlagTrendChart;