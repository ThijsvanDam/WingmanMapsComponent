import { FlightEnabled } from './../flight-details/flight-details.component';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {

  @Input()
  flights: Flight[] = [];

  @Output() flightsChanged = new EventEmitter<FlightEnabled>();

  constructor() { }

  ngOnInit(): void {
  }

  flightClicked(flightEnabled){
    this.flightsChanged.emit(flightEnabled);
  }
}
