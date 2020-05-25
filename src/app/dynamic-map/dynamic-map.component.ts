import { LeafletMap } from './LeafletMap';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.scss']
})
export class DynamicMapComponent implements AfterViewInit {
  private map;
  private currentlySelectedFlight;

  constructor() {
    this.currentlySelectedFlight = environment.flightJson[1];
  }

  ngAfterViewInit(): void {

    this.map = new LeafletMap();

    // this.map.addTileLayer('streetMap', {
    //   url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });
    this.map.addTileLayer('topoMap', {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

  }

  public handleAllAirstrips() {
    this.map.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.map.showRelevantAirstrips(this.currentlySelectedFlight);
  }

}
