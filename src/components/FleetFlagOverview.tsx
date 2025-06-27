import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Driver } from '../data/drivers';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  drivers: Driver[];
};

const FleetFlagOverview: React.FC<Props> = ({ drivers }) => {
  const counts = { none: 0, caution: 0, block: 0 };

  drivers.forEach((d) => {
    const flag = d.flag ?? 'none';
    counts[flag]++;
  });

  const data = {
    labels: ['✅ Clear', '⚠️ Caution', '🚫 Blocked'],
    datasets: [
      {
        label: 'Driver Flags',
        data: [counts.none, counts.caution, counts.block],
        backgroundColor: ['#22c55e88', '#facc1588', '#ef444488'],
        borderColor: ['#22c55e', '#facc15', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Fleet Health Overview</h2>
      <Pie data={data} />
    </div>
  );
};

export default FleetFlagOverview;
