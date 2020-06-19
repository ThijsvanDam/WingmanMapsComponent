import { FlightEnabled } from './../flight-list/flight-list.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Aircraft } from 'src/app/shared/models/airplane.model';
import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent implements OnInit {
  @Input()
  aircraft: Aircraft;

  @Input()
  flights: Flight[];

  @Output() flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() {
  }

  ngOnInit(): void {
  }

  flightsChanged(flightEnabled: FlightEnabled){
    this.flightsChangedHandler.emit(flightEnabled);
  }

}
