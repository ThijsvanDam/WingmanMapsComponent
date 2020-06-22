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

  @Output() flightsChangedHandler = new EventEmitter<FlightEnabled>();

  constructor() { }

  ngOnInit(): void {
  }

  flightClicked(event, flight){
    this.flightsChangedHandler.emit({
      flightId: flight.flightId,
      enabled: event.target.checked
    });
  }
}

export interface FlightEnabled{
  flightId: string;
  enabled: boolean;
}
