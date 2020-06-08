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

  constructor(private dataService: WingmanDataService, private mapService: WingmanMapService) {
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map');
    this.mapService.selectedFlight = this.dataService.getFirstFlight();
    this.mapService.showAllAirstrips();
  }

  public handleAllAirstrips() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.mapService.showRelevantAirstrips();
  }
}
