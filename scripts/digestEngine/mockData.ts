import { Driver } from './types';

export const drivers: Driver[] = [
  {
    id: '1',
    name: 'John Doe',
    region: 'East',
    history: [
      { date: '2025-06-24', value: 'block' },
      { date: '2025-06-26', value: 'none' },
    ],
  },
  {
    id: '2',
    name: 'Jane Doe',
    region: 'West',
    history: [
      { date: '2025-06-24', value: 'caution' },
      { date: '2025-06-26', value: 'none' },
    ],
  },
];