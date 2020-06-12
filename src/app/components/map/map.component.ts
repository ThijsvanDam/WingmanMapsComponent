import { Component, AfterViewInit } from '@angular/core';

import { WingmanDataService } from '../../services/wingman-data.service';
import { WingmanMapService } from '../../services/wingman-map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  constructor(private dataService: WingmanDataService, private mapService: WingmanMapService) {
    this.mapService.selectedFlights = this.dataService.getAllFlights();
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map');
    this.mapService.showRelevantAirstripMarkers();
    this.mapService.drawSelectedFlights();
  }
}
