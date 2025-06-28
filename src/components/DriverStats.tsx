import React, { useState, useEffect } from 'react';
import { Trip } from '../data/trips';
import { Driver, drivers as initialDrivers } from '../data/drivers';
import { fetchDriversFromAPI } from '../data/driverService';
import FleetFlagOverview from './FleetFlagOverview.tsx';
import FlagByRegionChart from './FlagByRegionChart.tsx';
import FlagTrendChart from './FlagTrendChart.tsx';

type FlagHistory = {
  date: string;
  value: Driver['flag'];
};

type EnrichedDriver = Driver & {
  history?: FlagHistory[];
  notes?: string;
};

type Props = {
  trips: Trip[];
};

const storageKey = 'fleetos_driver_flags_v5';

// Get the user's preferred locale (e.g. 'en', 'sw', etc.)
const userLocale = navigator.language?.slice(0, 2) ?? 'en';

// Helper to get driver name in the right language
const getDriverName = (driver: Driver, locale: string = 'en') => {
  const name = driver.name;
  return typeof name === 'string' ? name : name[locale] || name['en'] || '[Unnamed]';
};

const getSavedDrivers = (): EnrichedDriver[] => {
  const saved = localStorage.getItem(storageKey);
  try {
    return saved ? JSON.parse(saved) : initialDrivers;
  } catch {
    return initialDrivers;
  }
};

const saveDrivers = (data: EnrichedDriver[]) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

const getFlagColor = (flag: string | undefined) => {
  switch (flag) {
    case 'block':
      return 'text-red-700 bg-red-100';
    case 'caution':
      return 'text-yellow-800 bg-yellow-100';
    default:
      return 'text-green-700 bg-green-100';
  }
};

const exportCSV = (drivers: EnrichedDriver[]) => {
  const headers = ['Name', 'License', 'Region', 'Flag', 'Note', 'Last Changed'];
  const rows = drivers.map((d) => [
    getDriverName(d, userLocale),
    d.licenseNumber,
    d.region || 'Unassigned',
    d.flag ?? 'none',
    `"${(d.notes ?? '').replace(/"/g, '""')}"`,
    d.history?.[0]?.date ? new Date(d.history[0].date).toLocaleString() : '',
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'driver_flags_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportByRegion = (drivers: EnrichedDriver[]) => {
  const regions = Array.from(new Set(drivers.map((d) => d.region || 'Unassigned')));
  const headers = ['Region', 'Driver Name', 'License', 'Flag', 'Note', 'Last Flag Change'];
  const rows: string[][] = [];

  regions.forEach((region) => {
    const regionDrivers = drivers.filter((d) => (d.region || 'Unassigned') === region);

    regionDrivers.forEach((d) => {
      rows.push([
        region,
        getDriverName(d, userLocale),
        d.licenseNumber,
        d.flag ?? 'none',
        `"${(d.notes ?? '').replace(/"/g, '""')}"`,
        d.history?.[0]?.date ? new Date(d.history[0].date).toLocaleString() : '',
      ]);
    });

    const block = regionDrivers.filter((d) => d.flag === 'block').length;
    const caution = regionDrivers.filter((d) => d.flag === 'caution').length;
    const clear = regionDrivers.filter((d) => d.flag === 'none' || !d.flag).length;

    rows.push(['', '', '', '', '', '']);
    rows.push([`${region} Totals`, '', '', `🚫 ${block}`, `⚠️ ${caution}`, `✅ ${clear}`]);
    rows.push(['', '', '', '', '', '']);
  });

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'driver_flags_by_region.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DriverStats: React.FC<Props> = ({ trips }) => {
  const [driverList, setDriverList] = useState<EnrichedDriver[]>(getSavedDrivers());
  const [filterFlag, setFilterFlag] = useState<'all' | 'none' | 'caution' | 'block'>('all');

  // Fetch remote drivers if not in localStorage
  useEffect(() => {
    const loadRemoteDrivers = async () => {
      try {
        const apiDrivers = await fetchDriversFromAPI();
        if (Array.isArray(apiDrivers) && apiDrivers.length > 0) {
          setDriverList(apiDrivers);
          saveDrivers(apiDrivers);
        }
      } catch (error) {
        console.error('Failed to load remote drivers:', error);
      }
    };

    if (!localStorage.getItem(storageKey)) {
      loadRemoteDrivers();
    }
     
  }, []);

  useEffect(() => {
    saveDrivers(driverList);
  }, [driverList]);

  const getStats = (driverId: number) => {
    const driverTrips = trips.filter((t) => t.driverId === driverId);
    const completed = driverTrips.filter((t) => t.status === 'Completed').length;
    const ongoing = driverTrips.filter((t) => t.status === 'Ongoing').length;
    const total = driverTrips.length;

    const rated = driverTrips.filter((t) => typeof t.rating === 'number');
    const avgRating =
      rated.length === 0
        ? null
        : parseFloat(
            (rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length).toFixed(1)
          );

    return { total, completed, ongoing, avgRating, reviews: rated.length };
  };

  const handleFlagChange = (id: number, newFlag: Driver['flag']) => {
    const now = new Date().toISOString();
    setDriverList((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              flag: newFlag,
              history: [{ date: now, value: newFlag }, ...(d.history ?? [])].slice(0, 5),
            }
          : d
      )
    );
  };

  const handleNoteChange = (id: number, newNote: string) => {
    setDriverList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, notes: newNote } : d))
    );
  };

  const sortDrivers = (drivers: EnrichedDriver[]) => {
    const flagWeight = { block: 0, caution: 1, none: 2 };
    return [...drivers].sort((a, b) => {
      const weightA = flagWeight[a.flag ?? 'none'];
      const weightB = flagWeight[b.flag ?? 'none'];
      return weightA !== weightB
        ? weightA - weightB
        : getDriverName(a, userLocale).localeCompare(getDriverName(b, userLocale));
    });
  };

  const filteredDrivers = sortDrivers(
    filterFlag === 'all'
      ? driverList
      : driverList.filter((d) => (d.flag ?? 'none') === filterFlag)
  );

  return (
    <div>
      {/* Fleet health pie chart */}
      <FleetFlagOverview drivers={driverList} />
      <FlagByRegionChart drivers={driverList} />
      <FlagTrendChart drivers={driverList} /> {/* <-- Add this line */}

      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Flag:</label>
          <select
            value={filterFlag}
            onChange={(e) => setFilterFlag(e.target.value as typeof filterFlag)}
            className="text-sm border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="none">✅ Clear</option>
            <option value="caution">⚠️ Caution</option>
            <option value="block">🚫 Blocked</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filteredDrivers)}
            className="bg-blue-700 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-800"
          >
            ⬇️ Export CSV
          </button>
          <button
            onClick={() => exportByRegion(filteredDrivers)}
            className="bg-green-700 text-white text-sm px-4 py-1.5 rounded hover:bg-green-800"
          >
            📍 Export By Region
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredDrivers.map((driver) => {
          const stats = getStats(driver.id);
          const flagClass = getFlagColor(driver.flag);
          const recentChange = driver.history?.[0];

          return (
            <div key={driver.id} className="border-l-4 p-4 rounded shadow bg-white">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-blue-800">
                  {getDriverName(driver, userLocale)}
                  <span className="text-xs text-gray-500 ml-2">
                    ({driver.region || 'Unassigned'})
                  </span>
                </h2>
                <div className="relative group">
                  <select
                    value={driver.flag ?? 'none'}
                    onChange={(e) =>
                      handleFlagChange(driver.id, e.target.value as Driver['flag'])
                    }
                    className={`text-xs px-2 py-1 rounded border ${flagClass}`}
                  >
                    <option value="none">✅ Clear</option>
                    <option value="caution">⚠️ Caution</option>
                    <option value="block">🚫 Blocked</option>
                  </select>
                  {recentChange && (
                    <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 hidden group-hover:block whitespace-nowrap z-10 bg-gray-50 p-1 rounded shadow">
                      Last: {recentChange.value} on{' '}
                      {new Date(recentChange.date).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{driver.licenseNumber}</p>

              <textarea
                placeholder="Notes (e.g. 'Needs retraining on safety')"
                value={driver.notes ?? ''}
                onChange={(e) => handleNoteChange(driver.id, e.target.value)}
                className="w-full text-xs border rounded p-1 mb-2"
              />

              <p>Total Trips: {stats.total}</p>
              <p>Ongoing: {stats.ongoing}</p>
              <p>Completed: {stats.completed}</p>
              <p>
                Avg Rating:{' '}
                {stats.avgRating !== null
                  ? `${stats.avgRating} ★ (${stats.reviews})`
                  : '—'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverStats;
