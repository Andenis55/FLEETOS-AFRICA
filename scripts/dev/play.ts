// scripts/dev/play.ts
import { getWeekRange } from '../../src/utils/dateHelper';

const sample = '2025-06-26';
const { from, to } = getWeekRange(sample);
console.log(`📅 Week of ${sample}: ${from} – ${to}`);