import { Injectable } from '@angular/core';

import * as L from 'leaflet';

import { WingmanDataService } from './wingman-data.service';
import { WingmanMap } from '../dynamic-map/wingman-map';

import { environment } from './../../environments/environment';

@Injectable()
export class WingmanMapService {

  constructor(private dataService: WingmanDataService){ }

  private currentlySelectedFlight;
  private privateMap: WingmanMap;

  public initializeMap(mapId){
    this.map = new WingmanMap(this.dataService, mapId, {
      center: [-9.141666, 148.383331],
      zoom: 3
    });

    this.addLayers();
  }

  public set map(wingmanMap) {
    this.privateMap = wingmanMap;
  }

  public get map() {
    return this.privateMap;
  }

  public set selectedFlight(flight) {
    this.currentlySelectedFlight = flight;
  }

  private addLayers(){
    const baseMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      useCache: true,
      crossOrigin: true,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const weatherMap = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${environment.api_keys.openweathermap}`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    // Note: First add basemaps and add the overlay maps after, due to the fact that Leaflet doesn't load the overlaymaps otherwise.
    this.map.addBaseMap('Topographic map', baseMap);
    this.map.addOverlayMap('Clouds', weatherMap);
  }

  public showAllAirstrips() {
    this.privateMap.showAllAirstrips();
  }

  public showRelevantAirstrips() {
    this.privateMap.showRelevantAirstrips(this.currentlySelectedFlight);
  }
}
