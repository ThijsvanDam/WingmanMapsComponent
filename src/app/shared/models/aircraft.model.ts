export interface Aircraft{
  aircraftId?: string;
  displayName?: string;
  aircraftType?: string;
  aircraftTypeId?: string;
  homeBase?: string;
  registrationNo?: string;
  active?: boolean;
  maxSeats?: number;
  bow?: string;
  mtow?: string;
  mlw?: string;
  mrw?: string;
  mzfw?: string;
  bas?: string;
  fuelGaugesUnit?: number;
  fuelType?: number;
  fbr?: string;
  climbFuel?: string;
  taxiFuel?: string;
  fuelCapacity?: string;
  fuelReserve?: number;
  meterType?: number;
  crewRequired?: number;
  v2TrackUnitName?: string;
  departureDelay?: string;
  arrivalDelay?: string;
}
