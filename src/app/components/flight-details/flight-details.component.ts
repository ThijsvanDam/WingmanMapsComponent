import { Flight } from './../../shared/models/flight.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

  @Input()
  flight: Flight;

  @Output() clicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  flightSelected(){
    this.clicked.emit(this.flight.flightId);
  }
}
