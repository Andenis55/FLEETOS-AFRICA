import React from 'react';
import { drivers } from '../data/drivers';
import { Trip } from '../data/trips';

// Local Driver type for multilingual name support
type Driver = { name: string | { [key: string]: string }; id: number };

const userLocale = navigator.language?.slice(0, 2) ?? 'en';
const getDriverName = (driver: Driver, locale: string = 'en') => {
  const name = driver.name;
  return typeof name === 'string' ? name : name[locale] || name['en'] || '[Unnamed]';
};

type Props = {
  trips: Trip[];
};

const DriverLeaderboard: React.FC<Props> = ({ trips }) => {
  const getAverageRating = (driverId: number) => {
    const ratedTrips = trips.filter(
      t => t.driverId === driverId && typeof t.rating === 'number'
    );
    if (ratedTrips.length === 0) return null;
    const avg =
      ratedTrips.reduce((sum, t) => sum + (t.rating ?? 0), 0) / ratedTrips.length;
    return Number(avg.toFixed(2));
  };

  const rankedDrivers = drivers
    .map(d => {
      const avgRating = getAverageRating(d.id);
      return { ...d, avgRating };
    })
    .filter(d => d.avgRating !== null)
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 3);

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">🏆 Top Rated Drivers</h2>
      {rankedDrivers.length === 0 ? (
        <p className="text-gray-500 italic">No ratings available yet.</p>
      ) : (
        <ol className="list-decimal ml-5 space-y-2">
          {rankedDrivers.map((driver, index) => (
            <li key={driver.id} className="flex items-center justify-between">
              <span className="font-medium">{getDriverName(driver, userLocale)}</span>
              <span className="text-yellow-600 font-semibold">
                {driver.avgRating?.toFixed(2)} ★
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default DriverLeaderboard;
