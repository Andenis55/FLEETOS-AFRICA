import { drivers } from '../data/drivers';
import { Trip } from '../data/trips';

export function getBestAvailableDriver(trips: Trip[]) {
  const tripCounts: Record<number, number> = {};

  // Count how many trips each driver has
  trips.forEach((trip) => {
    tripCounts[trip.driverId] = (tripCounts[trip.driverId] || 0) + 1;
  });

  const availableDrivers = drivers.filter((driver) => {
    const hasOngoingTrip = trips.some(
      (t) => t.driverId === driver.id && t.status === 'Ongoing'
    );
    const isBlocked = driver.flag === 'block';
    return !hasOngoingTrip && !isBlocked;
  });

  // Sort by fewest number of total trips
  const sorted = availableDrivers.sort((a, b) => {
    const tripsA = tripCounts[a.id] || 0;
    const tripsB = tripCounts[b.id] || 0;
    return tripsA - tripsB;
  });

  return sorted[0] || null;
}
