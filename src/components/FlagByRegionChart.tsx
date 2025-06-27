import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import { Driver } from '../data/drivers';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  drivers: Driver[];
};

const FlagByRegionChart: React.FC<Props> = ({ drivers }) => {
  const regions = Array.from(new Set(drivers.map((d) => d.region || 'Unassigned')));

  const countsByRegion = regions.map((region) => {
    const regionDrivers = drivers.filter((d) => (d.region || 'Unassigned') === region);
    return {
      region,
      block: regionDrivers.filter((d) => d.flag === 'block').length,
      caution: regionDrivers.filter((d) => d.flag === 'caution').length,
      none: regionDrivers.filter((d) => !d.flag || d.flag === 'none').length,
    };
  });

  const data = {
    labels: countsByRegion.map((r) => r.region),
    datasets: [
      {
        label: '🚫 Blocked',
        data: countsByRegion.map((r) => r.block),
        backgroundColor: '#ef4444',
      },
      {
        label: '⚠️ Caution',
        data: countsByRegion.map((r) => r.caution),
        backgroundColor: '#facc15',
      },
      {
        label: '✅ Clear',
        data: countsByRegion.map((r) => r.none),
        backgroundColor: '#22c55e',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Flags by Region</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FlagByRegionChart;
