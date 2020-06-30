import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent {

  @Input()
  flights: Flight[] = [];

  @Output() flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() { }

  /**
   * Emit a @FlightEnabled event to the parent component if a flight is clicked.
   */
  flightClicked(enabled, flight) {
    this.flightsChangedHandler.emit({
      flightId: flight.flightId,
      enabled
    });
  }
}

/**
 * Interface to pass information through about which flight has been enabled whether or not.
 */
export interface FlightEnabled {
  flightId: string;
  enabled: boolean;
}
