import { Driver } from './drivers';

/**
 * Fetches driver data from a remote API.
 * Replace '/api/drivers' with your actual backend endpoint.
 */
export const fetchDriversFromAPI = async (): Promise<Driver[]> => {
  try {
    const response = await fetch('/api/drivers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${yourToken}`, // optional
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    // Optional: validate or sanitize the response here
    if (!Array.isArray(json.drivers)) {
      throw new Error('Malformed driver data structure');
    }

    return json.drivers as Driver[];
  } catch (error) {
    console.error('[Driver API] fetch failed:', error);
    return []; // Fallback — could trigger UI fallback or retry
  }
};