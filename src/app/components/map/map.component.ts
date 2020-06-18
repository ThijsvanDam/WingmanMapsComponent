import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    this.mapService.initializeMap('map');
  }
}
