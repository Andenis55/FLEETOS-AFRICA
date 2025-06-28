export type MultilingualName = {
  en: string;
  [locale: string]: string | undefined;
};

export type Driver = {
  id: string | number;
  name: MultilingualName;
  licenseNumber: string;
  assignedTrips: number;
  flag?: 'none' | 'caution' | 'block';
  region: string;
  location?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  // Add other fields as needed
};

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
