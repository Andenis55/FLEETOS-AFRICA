export interface Driver {
  id: string;
  name: string | { [lang: string]: string };
  region: string;
  history?: { date: string; value?: 'block' | 'caution' | 'none' }[];
}