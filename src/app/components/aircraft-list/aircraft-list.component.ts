import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Aircraft } from 'src/app/shared/models/airplane.model';
import { Flight } from 'src/app/shared/models/flight.model';
import { FlightEnabled } from './../flight-list/flight-list.component';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent implements OnInit {
  @Input()
  aircrafts: Aircraft[] = [];

  @Input()
  flightsByAircraftId: [] = [];

  @Output()
  flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() { }

  ngOnInit(): void {

  }

  getKeys(){
    return Object.keys(this.flightsByAircraftId);
  }

  getAircraftByAircraftId(aircraftId: string){
    return this.aircrafts.filter(aircraft => aircraft.aircraftId === aircraftId)[0];
  }

  getFlights(aircraftId: string): Flight[] {
    return this.flightsByAircraftId[aircraftId];
  }

  flightsChanged(flightEnabled: FlightEnabled) {
    this.flightsChangedHandler.emit(flightEnabled);
  }


}