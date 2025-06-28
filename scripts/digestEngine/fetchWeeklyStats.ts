import { drivers } from '@digestEngine/mockData';
import { digestConfig } from '@digestEngine/config';
import { format, getISOWeek, getYear, parseISO, startOfISOWeek, endOfISOWeek } from 'date-fns';

const getWeekKey = (dateStr: string) => {
  const date = parseISO(dateStr);
  const week = getISOWeek(date);
  const year = getYear(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export const getDigestData = () => {
  const weekly: Record<string, Record<'block' | 'caution' | 'none', number>> = {};

  drivers.forEach((driver) => {
    driver.history?.forEach((entry) => {
      const key = getWeekKey(entry.date);
      if (!weekly[key]) weekly[key] = { block: 0, caution: 0, none: 0 };
      weekly[key][entry.value ?? 'none']++;
    });
  });

  const weeks = Object.keys(weekly).sort();
  const current = weeks.at(-1)!;
  const previous = weeks.at(-2) ?? current;

  const cStats = weekly[current];
  const pStats = weekly[previous];

  const delta = {
    block: cStats.block - pStats.block,
    caution: cStats.caution - pStats.caution,
    none: cStats.none - pStats.none,
  };

  const regionMap = new Map<string, number>();
  drivers.forEach((d) => {
    const region = d.region ?? 'Unassigned';
    const count = d.history?.filter((h) => getWeekKey(h.date) === current).length ?? 0;
    if (count) regionMap.set(region, (regionMap.get(region) ?? 0) + count);
  });

  const [topRegion, changes] = [...regionMap.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0];

  const improved = drivers
    .filter((d) => {
      const h = d.history ?? [];
      const recent = h[0];
      const prior = h.find((e) => getWeekKey(e.date) !== current);
      return (
        recent &&
        getWeekKey(recent.date) === current &&
        recent.value === 'none' &&
        prior &&
        ['block', 'caution'].includes(prior.value!)
      );
    })
    .map((d) => (typeof d.name === 'string' ? d.name : d.name[digestConfig.defaultLanguage] ?? '[Unnamed]'));

  const from = format(startOfISOWeek(parseISO(`${current}-1`)), 'MMM d');
  const to = format(endOfISOWeek(parseISO(`${current}-1`)), 'MMM d');

  return {
    week: current,
    range: { from, to },
    stats: {
      block: { count: cStats.block, delta: delta.block },
      caution: { count: cStats.caution, delta: delta.caution },
      none: { count: cStats.none, delta: delta.none },
    },
    topRegion: { name: topRegion, changes },
    improvedDrivers: improved,
    chartImage: digestConfig.chartImagePath,
  };
};