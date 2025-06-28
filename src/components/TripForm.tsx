import React, { useState, useEffect } from 'react';
import { Trip } from '../data/trips';
import { drivers } from '../data/drivers';

// Multilingual name helper
type Driver = { name: string | { [key: string]: string }; id: number };
const userLocale = navigator.language?.slice(0, 2) ?? 'en';
const getDriverName = (driver: Driver, locale: string = 'en') => {
  const name = driver.name;
  return typeof name === 'string' ? name : name[locale] || name['en'] || '[Unnamed]';
};

type Props = {
  onAddTrip: (trip: Trip) => void;
  defaultDriverId?: number;
};

const TripForm: React.FC<Props> = ({ onAddTrip, defaultDriverId }) => {
  const [driverId, setDriverId] = useState<number>(defaultDriverId ?? 0);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('');
  const [status, setStatus] = useState<string>('Scheduled');

  useEffect(() => {
    if (defaultDriverId !== undefined) {
      setDriverId(defaultDriverId);
    }
  }, [defaultDriverId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    const newTrip: Trip = {
      id: Date.now(),
      driverId,
      driver: getDriverName(driver, userLocale),
      origin,
      destination,
      departureTime,
      status,
    };

    onAddTrip(newTrip);
    setOrigin('');
    setDestination('');
    setDepartureTime('');
    setStatus('Scheduled');
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 shadow mb-6 bg-white">
      <h2 className="font-semibold text-blue-700 mb-4">Create Trip</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={driverId}
          onChange={(e) => setDriverId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Driver</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {getDriverName(driver, userLocale)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="mt-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Trip
      </button>
    </form>
  );
};

export default TripForm;
