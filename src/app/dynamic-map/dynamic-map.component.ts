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
    this.mapService.selectedFlight = this.dataService.getFlightbyId('FPG034671');
    this.currentFlightName = this.mapService.selectedFlight.flightId;
    this.allFlights = this.dataService.getAllFlightNames();
  }



  ngAfterViewInit(): void {
    this.mapService.initializeMap('map');
    this.mapService.showRelevantAirstrips();
    this.mapService.plotFlight();
  }

  public handleAllAirstrips() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.mapService.showRelevantAirstrips();
  }

  public option(selectedFlight) {
    this.mapService.selectedFlight = this.dataService.getFlightbyId(selectedFlight);
    this.mapService.showRelevantAirstrips();
    this.mapService.plotFlight();
  }
}
