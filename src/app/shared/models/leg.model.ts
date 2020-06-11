export interface Leg {
  meetingTime?: string;
  meetingTimeFixed?: boolean;
  timeOnGround?: string;
  timeOnGroundFixed?: boolean;
  nightStop?: number;
  startTaxiTime?: string;
  destinationTaxiTime?: string;
  offBlockTimeFixed?: boolean;
  takeoffTimeFixed?: boolean;
  landingTimeFixed?: boolean;
  distance?: string;
  seatsTaken?: number;
  seatsLeft?: number;
  maxSeats?: number;
  startId?: string;
  destinationId?: string;
  offBlock?: string;
  takeoff?: string;
  landing?: string;
  onBlock?: string;
  estimate?: boolean;
  airTime?: number;
}
