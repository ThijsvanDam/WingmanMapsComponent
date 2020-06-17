import { WingmanDataService } from './../../services/wingman-data.service';
import { Component, OnInit } from '@angular/core';
import { WingmanMapService } from '../../services/wingman-map.service';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent {
  allFlights: string[];

  constructor(private mapService: WingmanMapService, private dataService: WingmanDataService) {
    // this.currentFlightName = this.mapService.selectedFlights[0].aircraftId;
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

  public flightsChanged(flightid){
    this.dataService.currentlySelectedFlights.next(
      this.dataService.currentlySelectedFlights.getValue().filter(flight => flight.flightId !== flightid)
      );
    // this.mapService.showRelevantAirstripMarkers();
    // this.mapService.drawSelectedFlights();
  }
}
