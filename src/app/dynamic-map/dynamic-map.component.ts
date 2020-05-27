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
  private _currentlySelectedFlight;
  private _map;

  constructor() {
    this._currentlySelectedFlight = environment.flightJson[1];
  }

  ngAfterViewInit(): void {  
    let map = L.map('map', {
      center: [-9.141666, 148.383331],
      zoom: 3
    });
      
      this.map = map;
      
      this.map.addTileLayer('topoMap', {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
  }

  public set map(leafletMap){
    this._map = new WingmanMap(leafletMap);
  }

  public set selectedFlight(flight){
    this._currentlySelectedFlight = flight;
  }
  

  public get map(){
    return this._map;
  }

  public handleAllAirstrips() {
    this._map.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this._map.showRelevantAirstrips(this._currentlySelectedFlight);
  }

}
