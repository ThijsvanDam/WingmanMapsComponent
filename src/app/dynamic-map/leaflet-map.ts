import * as L from 'leaflet';
import { TitleCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

export class WingmanMap {
  private _map;

  // Everything considering layers of the map
  private _baseLayers = {};
  private _attributions = {};

  // Everything considering markers
  private _markers = {};
  private _currentAirstripsGroup;
  private _icons;

  constructor(leafletMap) {
    this._map = leafletMap;

    this._icons = {
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

  public addTileLayer(name, layer) {
    // Create leaflet layer
    const tiles = L.tileLayer(layer.url, {
      maxZoom: 19,
      attribution: layer.attribution
    });

    // Keeping layer reference so it can be removed later
    this._baseLayers[name] = tiles;

    tiles.addTo(this._map);
  }

  private createAirstripMarkerList(airstrips) {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = airstrips.map(airstrip => {
      return L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? this._icons.waypoint : this._icons.airstrip }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(`This should be airstrip ${airstrip.name}`);
    });
    return airstripsArray;
  }

  private showAirstrips(airstrips) {
    // Remove the current marker layer
    if (this._currentAirstripsGroup) {
      this._map.removeLayer(this._currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this._currentAirstripsGroup = L.layerGroup(airstrips);
    this._map.addLayer(this._currentAirstripsGroup);
  }
}
