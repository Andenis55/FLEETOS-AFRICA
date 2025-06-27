import React, { useState } from 'react';
import { trips as initialTrips, Trip } from '../data/trips';
import { drivers } from '../data/drivers';
import TripForm from '../components/TripForm';
import TripTable from '../components/TripTable';
import DriverLeaderboard from '../components/DriverLeaderboard';
import DriverStats from '../components/DriverStats';
import TripFeedback from '../components/TripFeedback';
import { getBestAvailableDriver } from '../utils/assignDriver';

// Multilingual name helper
const userLocale = navigator.language?.slice(0, 2) ?? 'en';
const getDriverName = (driver: any, locale: string = 'en') => {
  const name = driver.name;
  return typeof name === 'string' ? name : name[locale] || name['en'] || '[Unnamed]';
};

const TripManager: React.FC = () => {
  const [tripList, setTripList] = useState<Trip[]>(initialTrips);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [smartDriverId, setSmartDriverId] = useState<number | undefined>();

  const handleAddTrip = (trip: Trip) => {
    const driver = drivers.find((d) => d.id === trip.driverId);
    if (driver) {
      driver.assignedTrips += 1;
    }
    setTripList((prev) => [...prev, trip]);
    setSmartDriverId(undefined); // Reset Smart Assign after submission
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTripList((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
  };

  const filteredTrips = tripList.filter((trip) => {
    const matchDriver = selectedDriverId === null || trip.driverId === selectedDriverId;
    const matchStatus = selectedStatus === '' || trip.status === selectedStatus;
    const tripDate = new Date(trip.departureTime);
    const matchStart = startDate === '' || tripDate >= new Date(startDate);
    const matchEnd = endDate === '' || tripDate <= new Date(endDate);
    return matchDriver && matchStatus && matchStart && matchEnd;
  });

  const totalTrips = tripList.length;
  const scheduledTrips = tripList.filter((t) => t.status === 'Scheduled').length;
  const ongoingTrips = tripList.filter((t) => t.status === 'Ongoing').length;
  const completedTrips = tripList.filter((t) => t.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Trip Manager</h1>

      {/* Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Trips</p>
          <p className="text-2xl font-bold text-blue-700">{totalTrips}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-700">{scheduledTrips}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Ongoing</p>
          <p className="text-2xl font-bold text-green-600">{ongoingTrips}</p>
        </div>
        <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-800">{completedTrips}</p>
        </div>
      </div>

      <DriverLeaderboard trips={tripList} />

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <select
          value={selectedDriverId ?? ''}
          onChange={(e) =>
            setSelectedDriverId(e.target.value === '' ? null : Number(e.target.value))
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">All Drivers</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {getDriverName(driver, userLocale)}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Smart Assign Button */}
      <button
        onClick={() => {
          const smartDriver = getBestAvailableDriver(tripList);
          if (smartDriver) {
            setSmartDriverId(smartDriver.id);
            alert(`Assigned to ${getDriverName(smartDriver, userLocale)}`);
          } else {
            alert('No available drivers found.');
          }
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🚀 Smart Assign
      </button>

      <TripForm onAddTrip={handleAddTrip} defaultDriverId={smartDriverId} />
      <TripTable trips={filteredTrips} />

      {tripList
        .filter((trip) => trip.status === 'Completed' && !trip.rating)
        .map((trip) => (
          <TripFeedback key={trip.id} trip={trip} onSubmit={handleUpdateTrip} />
        ))}

      <h2 className="text-xl font-semibold text-blue-700 mt-10 mb-4">Driver Performance</h2>
      <div className="bg-white shadow rounded p-4">
        <DriverStats trips={tripList} />
      </div>
    </div>
  );
};

export default TripManager;