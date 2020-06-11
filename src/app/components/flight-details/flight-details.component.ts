import { Flight } from './../../shared/models/flight.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

  @Input()
  flight: Flight;

  constructor() { }

  ngOnInit(): void {
  }

  public switch(){
    console.log();

  }

}
