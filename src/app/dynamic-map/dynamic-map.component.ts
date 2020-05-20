import * as Map from './LeafletMap';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-dynamic-map',
  templateUrl: './dynamic-map.component.html',
  styleUrls: ['./dynamic-map.component.scss']
})
export class DynamicMapComponent implements AfterViewInit {
  private map;

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new Map.LeafletMap([39.8282, -98.5795], 3);
    this.map.addTileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      );
  }
}
