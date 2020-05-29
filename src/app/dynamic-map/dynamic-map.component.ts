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

    const owmApi = '669d6d341ee2ac57f0fe2b2218038297';
    const owmSecondKey = 'b40f8eb506d68e99562d3b860331783c';

    const secondBaseMap = L.tileLayer(`http://{s}.sat.owm.io/sql/{z}/{x}/{y}/?appid=${owmSecondKey}&overzoom=true&op=rgb&from=cloudless&select=b4,b3,b2`, {
      attribution: 'vane?'
    });

    const cloudsOverlay = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${owmApi}`, {
      attribution: 'OpenWeatherMap'
    });

    const precipitationMap = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${owmApi}`, {
      attribution: 'OpenWeatherMap'
    });

    const windspeedMap = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${owmApi}`, {
      attribution: 'OpenWeatherMap'
    });

    const temperatureMap = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${owmApi}`, {
      attribution: 'OpenWeatherMap'
    });

    this.map.addBaseMap('Topographic map', baseMap);
    this.map.addBaseMap('Sat map', secondBaseMap);
    this.map.addOverlayMap('Clouds', cloudsOverlay);
    this.map.addOverlayMap('Precipitation', precipitationMap);
    this.map.addOverlayMap('Wind speed', windspeedMap);
    this.map.addOverlayMap('Temperature', temperatureMap);
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
