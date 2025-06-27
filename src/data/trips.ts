export type Trip = {
  id: number;
  driverId: number;
  driver: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
  rating?: number;
  feedback?: string;
};

export const trips: Trip[] = [
  {
    id: 1,
    driverId: 1,
    driver: 'John Mwangi',
    origin: 'Nairobi',
    destination: 'Kampala',
    departureTime: '2025-06-26T08:00:00',
    status: 'Scheduled',
  },
  {
    id: 2,
    driverId: 2,
    driver: 'Fatou Bamba',
    origin: 'Dakar',
    destination: 'Abidjan',
    departureTime: '2025-06-25T14:30:00',
    status: 'Ongoing',
  },
  {
    id: 3,
    driverId: 3,
    driver: 'Samuel Ndlovu',
    origin: 'Harare',
    destination: 'Lusaka',
    departureTime: '2025-06-24T09:00:00',
    status: 'Completed',
  },
  {
    id: 4,
    driverId: 2,
    driver: 'Fatou Bamba',
    origin: 'Bamako',
    destination: 'Ouagadougou',
    departureTime: '2025-06-27T10:00:00',
    status: 'Ongoing',
  },
];
