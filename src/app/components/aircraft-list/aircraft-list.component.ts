import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Aircraft } from 'src/app/shared/models/aircraft.model';
import { Flight } from 'src/app/shared/models/flight.model';
import { FlightEnabled } from './../flight-list/flight-list.component';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent {
  @Input()
  aircrafts: Aircraft[] = [];

  @Input()
  flightsByAircraftId: [] = [];

  @Output()
  flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() { }

  getAircraftIds(){
    return Object.keys(this.flightsByAircraftId);
  }

  /**
   * Get aircraft by aircraft ID from the passed through aircrafts list.
   */
  getAircraftByAircraftId(aircraftId: string){
    return this.aircrafts.filter(aircraft => aircraft.aircraftId === aircraftId)[0];
  }

  /**
   * Get flight list by aircraft id
   */
  getFlights(aircraftId: string): Flight[] {
    return this.flightsByAircraftId[aircraftId];
  }

  /**
   * Emit a @FlightEnabled event to the parent component if a flight is clicked.
   */
  flightsChanged(flightEnabled: FlightEnabled) {
    this.flightsChangedHandler.emit(flightEnabled);
  }
}
