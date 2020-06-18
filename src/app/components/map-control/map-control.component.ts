import { FlightEnabled } from './../flight-details/flight-details.component';
import { WingmanDataService } from './../../services/wingman-data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WingmanMapService } from '../../services/wingman-map.service';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent {
  allFlights: string[];

  constructor(private mapService: WingmanMapService, private dataService: WingmanDataService) {
    this.allFlights = this.dataService.getAllFlightNames();
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
