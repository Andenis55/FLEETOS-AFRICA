import React from 'react';
import { Trip } from '../data/trips';

type Props = {
  trips: Trip[];
};

const TripTable: React.FC<Props> = ({ trips }) => {
  return (
    <div className="overflow-x-auto shadow rounded bg-white">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2">Driver</th>
            <th className="px-4 py-2">Origin</th>
            <th className="px-4 py-2">Destination</th>
            <th className="px-4 py-2">Departure</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id} className="border-t hover:bg-gray-100">
              <td className="px-4 py-2">{trip.driver}</td>
              <td className="px-4 py-2">{trip.origin}</td>
              <td className="px-4 py-2">{trip.destination}</td>
              <td className="px-4 py-2">
                {new Date(trip.departureTime).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trip.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : trip.status === 'Ongoing'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {trip.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripTable;
