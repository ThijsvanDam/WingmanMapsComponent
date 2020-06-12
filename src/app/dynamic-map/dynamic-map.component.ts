import { WingmanMapService } from './../services/wingman-map.service';
import { Component, AfterViewInit } from '@angular/core';

import { WingmanDataService } from '../services/wingman-data.service';
import { WingmanMap } from './wingman-map';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.scss']
})
export class DynamicMapComponent implements AfterViewInit {
  currentFlightName: string;
  allFlights: string[];

  constructor(private dataService: WingmanDataService, private mapService: WingmanMapService) {
    // this.mapService.setSelectedFlight(this.dataService.getFlightbyId('FPG034707'));
    this.mapService.selectedFlights = this.dataService.getAllFlights();
    this.currentFlightName = this.mapService.selectedFlights[0].aircraftId;
    this.allFlights = this.dataService.getAllFlightNames();
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map');
    this.mapService.showRelevantAirstripMarkers();
    this.mapService.drawSelectedFlights();
  }

  public handleAllAirstrips() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.mapService.showRelevantAirstripMarkers();
  }

  public option(selectedFlight) {
    this.mapService.setSelectedFlight(this.dataService.getFlightbyId(selectedFlight));
    this.mapService.showRelevantAirstripMarkers();
    this.mapService.drawSelectedFlights();
  }

  public showAllFlights(){
    this.mapService.selectedFlights = this.dataService.getAllFlights();
    this.mapService.showRelevantAirstripMarkers();
    this.mapService.drawSelectedFlights();
  }
}
