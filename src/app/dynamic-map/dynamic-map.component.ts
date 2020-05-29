import { Component, AfterViewInit } from '@angular/core';

import { environment } from 'src/environments/environment';

import { WingmanMap } from './leaflet-map';
import * as L from 'leaflet';


@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.scss']
})
export class DynamicMapComponent implements AfterViewInit {
  private currentlySelectedFlight;
  private privateMap;

  constructor() {
    this.currentlySelectedFlight = environment.flightJson[1];
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [-9.141666, 148.383331],
      zoom: 3
    });

    const baseMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map.addBaseMap('Topographic map', baseMap);

    const owmApi = '669d6d341ee2ac57f0fe2b2218038297';
    const weatherMap = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${owmApi}`, {
      attribution: 'OpenWeatherMap'
    });
    this.map.addOverlayMap('Clouds', weatherMap);

  }

  public set map(leafletMap) {
    this.privateMap = new WingmanMap(leafletMap);
  }

  public get map() {
    return this.privateMap;
  }

  public set selectedFlight(flight) {
    this.currentlySelectedFlight = flight;
  }

  public handleAllAirstrips() {
    this.privateMap.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.privateMap.showRelevantAirstrips(this.currentlySelectedFlight);
  }

}
