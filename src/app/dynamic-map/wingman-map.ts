import { Injectable } from '@angular/core';

// Downloaded from https://github.com/MazeMap/Leaflet.TileLayer.PouchDBCached
// import * as L from 'leaflet';
import { Map, Icon, MapOptions, Control, LayerGroup, Marker } from 'leaflet';

import 'src/assets/javascript/L.TileLayer.PouchDBCached.js';

import { WingmanDataService } from './../services/wingman-data.service';

import { environment } from 'src/environments/environment';

export class WingmanMap extends Map {
  // Everything considering layers of the map
  private attributions = {};
  private overlayMaps = {};
  private baseMaps = {};

  // Everything considering markers
  private markers = {};
  private currentAirstripsGroup;
  private icons;

  private mapControl;

  constructor(private dataService: WingmanDataService, mapId: string, options?: MapOptions) {
    super(mapId, options);

    this.icons = {
      airstrip: new Icon({
        iconUrl: environment.marker.airstrip_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      }),
      waypoint: new Icon({
        iconUrl: environment.marker.waypoint_image,
        iconSize: [30, 30],
        iconAnchor: [-10, 0],
        popupAnchor: [0, 0]
      })
    };

    // As a default, show all airstrips
    this.showAllAirstrips();
  }

  public showRelevantAirstrips(flight) {    // Gathers the airstrips IDs from the legs
    let relevantAirstripIds = [];
    flight.legs.forEach(leg => {
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

  public showAllAirstrips() {
    // The public method for showing all airstrips,
    // gathering them from the environmentally set airstrip json
    const airstripMarkers = this.createAirstripMarkerList(this.dataService.getAllAirstrips());
    this.showAirstrips(airstripMarkers);
  }

  private createAirstripMarkerList(airstrips) {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = airstrips.map(airstrip => {
      return new Marker(
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
      this.removeLayer(this.currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this.currentAirstripsGroup = new LayerGroup(airstrips);
    this.addLayer(this.currentAirstripsGroup);
  }

  public addBaseMap(mapName, leafletBaseLayer){
    // Remember the base map locally
    this.baseMaps[mapName] = leafletBaseLayer;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined){
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[mapName] = leafletBaseLayer;
      this.mapControl = new Control.Layers(layerObject, undefined).addTo(this);
    }else{
      this.mapControl.addBaseLayer(leafletBaseLayer, mapName);
    }
  }

  public addOverlayMap(mapName, leafletOverlayMap){
    // Remember the overlay locally
    this.overlayMaps[mapName] = leafletOverlayMap;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined){
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[mapName] = leafletOverlayMap;
      this.mapControl = new Control.Layers(undefined, layerObject).addTo(this);
    }else{
      this.mapControl.addOverlay(leafletOverlayMap, mapName);
    }
  }
}
