import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FlightEnabled } from './../flight-list/flight-list.component';

import { Aircraft } from 'src/app/shared/models/aircraft.model';
import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent {
  @Input()
  aircraft: Aircraft;

  @Input()
  flights: Flight[];

  @Output() flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() {
  }

  /**
   * Emit a @FlightEnabled event to the parent component if a flight is clicked.
   */
  flightsChanged(flightEnabled: FlightEnabled) {
    this.flightsChangedHandler.emit(flightEnabled);
  }

}
