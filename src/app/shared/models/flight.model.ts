import { Leg } from './leg.model';

export interface Flight{
  flightId?: string;
  mainBookingId?: string;
  flightDescription?: string;
  route?: string;
  airTime?: number;
  flightTime?: number;
  startDate?: string;
  aircraftId?: string;
  homeBaseId?: string;
  pilotId?: string;
  coPilotId?: string;
  status?: string;
  legs?: Leg[];
}
