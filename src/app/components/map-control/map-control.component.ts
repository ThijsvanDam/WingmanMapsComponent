import { Component, OnInit, OnDestroy } from '@angular/core';

import { FlightEnabled } from './../flight-list/flight-list.component';

import { WingmanDataService } from './../../services/wingman-data.service';
import { WingmanMapService } from '../../services/wingman-map.service';

import { Aircraft } from './../../shared/models/airplane.model';
import { Flight } from 'src/app/shared/models/flight.model';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent {
  allFlights: string[];
  aircrafts: Aircraft[];

  constructor(private mapService: WingmanMapService, private dataService: WingmanDataService) {
    this.allFlights = this.dataService.getAllFlightNames();
    // this.dataService.currentlySelectedFlights.subscribe(flights => this.getAircrafts(flights));
   }

  public handleAllAirstrips() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.mapService.showRelevantAirstripMarkers();
  }

  public getFlights(){
    return this.dataService.getAllFlights();
  }

  public getAircrafts(){
    const selectedFlights = this.dataService.getAllFlights().filter(x => x.aircraftId !== null);
    return this.dataService.getAircraftsByFlightList(selectedFlights);
  }

  public getFlightsWithoutAircraft(){
    return this.dataService.getAllFlights().filter(x => x.aircraftId === null);
  }

  public getFlightsByAircraft(){
    const flights = this.dataService.getAllFlights().filter(x => x.aircraftId !== null);
    return this.dataService.groupFlightsByAircraftId(flights);
  }

  public option(selectedFlight) {
    this.dataService.currentlySelectedFlights.next([this.dataService.getFlightbyId(selectedFlight)]);
  }

  public showAllFlights(){
    this.dataService.currentlySelectedFlights.next(this.dataService.getAllFlights());
  }

  public flightsChanged(flightEnabled: FlightEnabled){
    let nextFlights;

    if (flightEnabled.enabled){
        nextFlights = this.dataService.currentlySelectedFlights.getValue();
        nextFlights.push(this.dataService.getFlightbyId(flightEnabled.flightId));
    }else{
        nextFlights = this.dataService.currentlySelectedFlights.getValue().filter(flight => flight.flightId !== flightEnabled.flightId);
    }
    this.dataService.currentlySelectedFlights.next(nextFlights);
  }
}
