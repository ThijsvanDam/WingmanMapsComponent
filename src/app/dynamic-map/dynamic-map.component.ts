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

  constructor(private dataService: WingmanDataService, private mapService: WingmanMapService) {
    this.mapService.selectedFlight = this.dataService.getFlightbyId('FPG034737');
    this.currentFlightName = this.mapService.selectedFlight.flightId;
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
}
