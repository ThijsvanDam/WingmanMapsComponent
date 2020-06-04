export interface Airstrip {
  airstripId: string;
  displayName: string;
  name: string;
  waypointOnly: boolean;
  airstripClosed: boolean;
  mafBase: boolean;
  country: string;
  active: boolean;
  countryId: string;
  position: {
    latDeg: number;
    longDeg: number;
  };
  preFlightTaxiTime: string;
  postFlightTaxiTime: string;
  meetingTimeAdvance: string;
  avgasAvailable: boolean;
  jetA1Available: boolean;
  departureTaxApplies: boolean;
}
