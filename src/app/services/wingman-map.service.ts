import { Injectable } from '@angular/core';

import * as L from 'leaflet';

import { WingmanDataService } from './wingman-data.service';
import { WingmanMap } from '../dynamic-map/wingman-map';

import { environment } from './../../environments/environment';

@Injectable()
export class WingmanMapService {

  constructor(private dataService: WingmanDataService) { }

  private currentlySelectedFlight;
  private privateMap: WingmanMap;

  private currentAirstripsGroup;

  public initializeMap(mapId) {
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

  private addLayers() {
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
    // The public method for showing all airstrips,
    // gathering them from the environmentally set airstrip json
    const airstripMarkers = this.createAirstripMarkerList(this.dataService.getAllAirstrips());
    this.showAirstrips(airstripMarkers);
  }

  public showRelevantAirstrips() {    // Gathers the airstrips IDs from the legs
    let relevantAirstripIds = [];
    this.currentlySelectedFlight.legs.forEach(leg => {
      relevantAirstripIds.push(leg.startId);
      relevantAirstripIds.push(leg.destinationId);
    });


    // Filter duplicate ID's
    relevantAirstripIds = relevantAirstripIds.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    // Get only the relevant airstrip info
    const relevantAirstrips = this.dataService.getAirstripsByIdList(relevantAirstripIds);

    // Create the marker list and show them on the screen
    const relevantAirstripMarkers = this.createAirstripMarkerList(relevantAirstrips);
    this.showAirstrips(relevantAirstripMarkers);
  }

  private showAirstrips(airstrips) {
    // Remove the current marker layer
    if (this.currentAirstripsGroup) {
      this.privateMap.removeLayer(this.currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this.currentAirstripsGroup = L.layerGroup(airstrips);
    this.map.addLayer(this.currentAirstripsGroup);
  }

  private createAirstripMarkerList(airstrips) {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = airstrips.map(airstrip => {
      return L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? this.privateMap.icons.waypoint : this.privateMap.icons.airstrip }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(`This should be airstrip ${airstrip.name}`);
    });
    return airstripsArray;
  }

}
