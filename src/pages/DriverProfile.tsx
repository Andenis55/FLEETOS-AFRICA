import React from 'react';
import { useParams } from 'react-router-dom';
import { drivers } from '../data/drivers';
import { trips } from '../data/trips';

// Multilingual name helper
const userLocale = navigator.language?.slice(0, 2) ?? 'en';
const getDriverName = (driver: any, locale: string = 'en') => {
  const name = driver.name;
  return typeof name === 'string' ? name : name[locale] || name['en'] || '[Unnamed]';
};

const DriverProfile: React.FC = () => {
  const { id } = useParams();
  // Support both string and number IDs
  const driver = drivers.find((d) => String(d.id) === String(id));

  if (!driver) return <p className="text-red-600">Driver not found.</p>;

  const driverTrips = trips.filter((trip) => String(trip.driverId) === String(driver.id));

  return (
    <div className="bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">{getDriverName(driver, userLocale)}</h1>

      <div className="mb-3">
        {driver.status && (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              driver.status === 'Available'
                ? 'bg-green-100 text-green-700'
                : driver.status === 'On Trip'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {driver.status}
          </span>
        )}
      </div>

      {driver.email && <p>Email: {driver.email}</p>}
      {driver.phone && <p>Phone: {driver.phone}</p>}
      <p>License #: {driver.licenseNumber}</p>
      <p>Trips Assigned: {driver.assignedTrips}</p>

      <h2 className="text-xl font-bold mt-6 mb-2 text-gray-700">Trip History</h2>
      <ul className="text-sm text-gray-600 list-disc pl-5">
        {driverTrips.map((trip) => (
          <li key={trip.id}>
            {trip.origin} → {trip.destination} on{' '}
            {new Date(trip.departureTime).toLocaleDateString()} ({trip.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverProfile;