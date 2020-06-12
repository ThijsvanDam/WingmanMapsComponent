import { Component, OnInit, Input } from '@angular/core';
import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {

  @Input()
  flights: Flight[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
