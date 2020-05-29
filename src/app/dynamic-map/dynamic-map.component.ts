
import { LeafletMap } from './LeafletMap';
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
    this.currentlySelectedFlight = environment.flightJson[0];
  }

  ngAfterViewInit(): void {

    this.map = new LeafletMap();

    this.map.addTileLayer('streetMap', {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  }

  public set map(leafletMap){
    this.privateMap = new WingmanMap(leafletMap);
  }

  public get map(){
    return this.privateMap;
  }

  public set selectedFlight(flight){
    this.currentlySelectedFlight = flight;
  }

  public handleAllAirstrips() {
    this.privateMap.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.privateMap.showRelevantAirstrips(this.currentlySelectedFlight);
  }

}
