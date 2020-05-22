import * as L from 'leaflet';
import { TitleCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

import { MapIcon } from './MapIcon';

export class LeafletMap {



  private map;
  private baseLayers = {};
  private attributions = {};
  private markers = {};

  private currentAirstripsGroup;

  private airstripIcon;
  private waypointIcon;

  constructor(center: [number, number] = [39.8282, -98.5795], zoom: number = 3) {
    this.map = L.map('map', {
      center: center,
      zoom: zoom
    });

    this.airstripIcon = L.icon({
      iconUrl: environment.marker.airstrip_image,
      iconSize: [20, 20],
      iconAnchor: [-10, 0],
      popupAnchor: [20, 0]
    });

    this.waypointIcon = L.icon({
      iconUrl: environment.marker.waypoint_image,
      iconSize: [30, 30],
      iconAnchor: [-10, 0],
      popupAnchor: [20, 0]
    });

    this.addAirstrips();
  }

  public showAllAirstrips() {

  }

  public showRelevantAirstrips(flight) {
    
  }

  public addAirstrips() {

    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = environment.airstripJson.map(airstrip => {
      return L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? this.waypointIcon : this.airstripIcon }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(`This should be airstrip ${airstrip.name}`);
    });

    this.showAirstrips(airstripsArray);
  }
 
  private showAirstrips(airstrips){
    if (this.currentAirstripsGroup) {
      this.map.removeLayer(this.currentAirstripsGroup);
    }
    this.currentAirstripsGroup = L.layerGroup(airstrips);
    this.map.addLayer(this.currentAirstripsGroup);
  }


  public addAttribution(name, attribution) {
    this.attributions[name] = this.attributions;
  }

  public addTileLayer(name, layer) {
    this.baseLayers[name] = layer;

    const tiles = L.tileLayer(layer.url, {
      maxZoom: 19,
      attribution: this.attributions[layer.attribution]
    });

    tiles.addTo(this.map);
  }
}