import React from 'react';
import { Link } from 'react-router-dom';

// Multilingual name type
export type MultilingualName = {
  en: string; // English
  sw?: string; // Swahili
  ha?: string; // Hausa
  [locale: string]: string | undefined; // Extendable
};

// Driver type
export type Driver = {
  id: number;
  name: MultilingualName;
  licenseNumber: string;
  assignedTrips: number;
  flag?: 'none' | 'caution' | 'block';
  region: string;
  location?: {
    lat: number;
    lng: number;
    updatedAt: string; // ISO timestamp
  };
};

// Example drivers array
export const drivers: Driver[] = [
  {
    id: 1,
    name: {
      en: "James Okoro",
      sw: "James Okoro",
    },
    licenseNumber: "KE-0123",
    assignedTrips: 5,
    flag: "block",
    region: "Nairobi",
    location: {
      lat: -1.2921,
      lng: 36.8219,
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    name: {
      en: "Amina Yusuf",
      ha: "Amina Yusuf",
    },
    licenseNumber: "NG-0456",
    assignedTrips: 2,
    flag: "none",
    region: "Lagos",
  },
  {
    id: 3,
    name: {
      en: "Kwame Mensah",
    },
    licenseNumber: "GH-0789",
    assignedTrips: 3,
    flag: "caution",
    region: "Accra",
  },
  {
    id: 4,
    name: {
      en: "Fatou Ndiaye",
      sw: "Fatou Ndiaye",
    },
    licenseNumber: "SN-0912",
    assignedTrips: 1,
    flag: "none",
    region: "Dakar",
  },
];

// Placeholder for async fetch, e.g., from Firebase or REST API
export const fetchDriversFromAPI = async (): Promise<Driver[]> => {
  const response = await fetch('/api/drivers'); // Customize endpoint
  const json = await response.json();
  return json.drivers;
};

const Drivers: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Our Drivers</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <Link
            key={driver.id}
            to={`/drivers/${driver.id}`}
            className="block bg-white shadow rounded p-4 flex flex-col items-center hover:shadow-lg transition"
          >
            {/* If you have a photoUrl, use it; otherwise, fallback */}
            <img
              src={
                // @ts-expect-error
                driver.photoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name.en)}`
              }
              alt={driver.name.en}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800">{driver.name.en}</h2>
            <p className="text-sm text-gray-500">{/* Email not in type, skip or add if needed */}</p>
            <p className="text-sm text-gray-500">{/* Phone not in type, skip or add if needed */}</p>
            <p className="mt-2 text-sm">
              License: <span className="font-medium">{driver.licenseNumber}</span>
            </p>
            <p className="text-sm">Trips Assigned: {driver.assignedTrips}</p>
            <p className="text-sm">
              Flag:{" "}
              {driver.flag === "block"
                ? "🚫 Blocked"
                : driver.flag === "caution"
                ? "⚠️ Caution"
                : "✅ Clear"}
            </p>
            <p className="text-xs text-gray-400">{driver.region}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
