import { Observable } from 'rxjs';
import { Component, AfterViewInit } from '@angular/core';

import { WingmanDataService } from '../../services/wingman-data.service';
import { WingmanMapService } from '../../services/wingman-map.service';
import { CookieService } from '../../services/cookie.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  constructor(private mapService: WingmanMapService) {
  }

  ngAfterViewInit(): void {
    // The map can only be initialized after the view is done, because leaflet hooks onto the HTML element.
    this.mapService.initializeMap('map');
  }
}
