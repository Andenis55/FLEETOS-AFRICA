import React, { useState } from 'react';
import { Trip } from '../data/trips';

type Props = {
  trip: Trip;
  onSubmit: (updatedTrip: Trip) => void;
};

const TripFeedback: React.FC<Props> = ({ trip, onSubmit }) => {
  const [rating, setRating] = useState<number>(trip.rating ?? 0);
  const [feedback, setFeedback] = useState<string>(trip.feedback ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...trip, rating, feedback });
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 bg-white shadow mt-4">
      <h3 className="font-bold text-blue-700 mb-2">Rate {trip.driver}</h3>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          <option value={0}>--</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write feedback..."
        className="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default TripFeedback;
