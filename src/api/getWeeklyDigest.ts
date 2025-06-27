import { getDigestData } from '@utils/digestEngine/fetchWeeklyStats';

export async function GET() {
  const data = getDigestData();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}