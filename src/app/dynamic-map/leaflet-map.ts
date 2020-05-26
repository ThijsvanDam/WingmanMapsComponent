import * as L from 'leaflet';
import { TitleCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

export class LeafletMap {
  private map;

  // Everything considering layers of the map
  private baseLayers = {};
  private attributions = {};

  // Everything considering markers
  private markers = {};
  private currentAirstripsGroup;
  private icons;

  constructor(center: [number, number] = [-9.141666, 148.383331], zoom: number = 3) {
    this.map = L.map('map', {
      center,
      zoom
    });

    this.icons = {
      airstrip: L.icon({
        iconUrl: environment.marker.airstrip_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      }),
      waypoint: L.icon({
        iconUrl: environment.marker.waypoint_image,
        iconSize: [30, 30],
        iconAnchor: [-10, 0],
        popupAnchor: [0, 0]
      })
    };

    // As a default, show all airstrips
    this.showAllAirstrips();
  }

  public showRelevantAirstrips(flight) {
    // Gathers the airstrips IDs from the legs
    const relevantAirstripIds = [];
    flight.legs.forEach(leg => {
      relevantAirstripIds.push(leg.startId);
      relevantAirstripIds.push(leg.destinationId);
    });

    // Get only the relevant airstrip info
    const relevantAirstrips = environment.airstripJson.filter(airstrip => {
      return relevantAirstripIds.indexOf(airstrip.airstripId) > -1;
    });

    // Create the marker list and show them on the screen
    const relevantAirstripMarkers = this.createAirstripMarkerList(relevantAirstrips);
    this.showAirstrips(relevantAirstripMarkers);
  }

  public showAllAirstrips() {
    // The public method for showing all airstrips,
    // gathering them from the environmentally set airstrip json
    const airstripMarkers = this.createAirstripMarkerList(environment.airstripJson);
    this.showAirstrips(airstripMarkers);
  }


  public addAttribution(name, attribution) {
    // Add attribution to list so it can still be easily gathered
    this.attributions[name] = this.attributions;
  }

  public addTileLayer(name, layer) {
    // Create leaflet layer
    const tiles = L.tileLayer(layer.url, {
      maxZoom: 19,
      attribution: this.attributions[layer.attribution]
    });

    // Keeping layer reference so it can be removed later
    this.baseLayers[name] = tiles;

    tiles.addTo(this.map);
  }

  public getMap(){
    return this.map;
  }

  private createAirstripMarkerList(airstrips) {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = airstrips.map(airstrip => {
      return L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? this.icons.waypoint : this.icons.airstrip }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(`This should be airstrip ${airstrip.name}`);
    });
    return airstripsArray;
  }

  private showAirstrips(airstrips) {
    // Remove the current marker layer
    if (this.currentAirstripsGroup) {
      this.map.removeLayer(this.currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this.currentAirstripsGroup = L.layerGroup(airstrips);
    this.map.addLayer(this.currentAirstripsGroup);
  }
}
