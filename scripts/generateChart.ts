// scripts/generateChart.ts
import { Chart, registerables, ChartItem } from 'chart.js';
import { createCanvas } from 'canvas';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

Chart.register(...registerables);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateChart = async () => {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  new Chart(ctx as unknown as ChartItem, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Deliveries',
          data: [12, 19, 7, 15, 10],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Weekly Fleet Deliveries',
        },
      },
    },
  });

  const outPath = path.join(__dirname, '../public/weekly-digest-chart.png');
  await writeFile(outPath, canvas.toBuffer('image/png'));
  console.log(`📊 Chart saved to ${outPath}`);
};

await generateChart();
