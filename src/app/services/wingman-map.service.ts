import { Leg } from './../shared/models/leg.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Injectable } from '@angular/core';

import * as L from 'leaflet';

import { Flight } from './../shared/models/flight.model';
import { WingmanDataService } from './wingman-data.service';
import { WingmanMap } from '../dynamic-map/wingman-map';
import { NoFlightSelectedException } from '../shared/exceptions/no-flight-selected.exception';
import { environment } from './../../environments/environment';

@Injectable()
export class WingmanMapService {
  public icons;
  private privateMap: WingmanMap;

  private currentlySelectedFlight: Flight;
  private currentAirstripsGroup: L.LayerGroup;
  private currentlyPlottedFlight: any;

  constructor(private dataService: WingmanDataService) {

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
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      })
    };
  }

  public initializeMap(mapId) {
    this.map = new WingmanMap(this.dataService, mapId, {
      // This is hardcoded and set to the center of papua new guinea
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

  public get selectedFlight() {
    return this.currentlySelectedFlight;
  }

  private addLayers() {
    const OWM_KEY = environment.api_keys.openweathermap;

    // Add all base maps:
    const topographicMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      useCache: true,
      crossOrigin: true,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satelliteMap = L.tileLayer(`http://{s}.sat.owm.io/sql/{z}/{x}/{y}/?appid=${OWM_KEY}&overzoom=true&op=rgb&from=cloudless&select=b4,b3,b2`, {
      attribution: 'vane?'
    });

    const blackWhiteMap = L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: ''
    });

    const watercolor = L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg	', {
      attribution: ''
    });

    // Note: First add basemaps and add the overlay maps after, due to the fact that Leaflet doesn't load the overlaymaps otherwise.
    this.map.addBaseMap('Topographic map', topographicMap, { enable: true });
    this.map.addBaseMap('Sat map', satelliteMap);
    this.map.addBaseMap('Black white', blackWhiteMap);
    this.map.addBaseMap('Water color', watercolor);

    // Add all overla maps:
    const cloudsOverlay = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      attribution: 'OpenWeatherMap'
    });

    const precipitationOverlay = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      attribution: 'OpenWeatherMap'
    });

    const windspeedOverlay = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      attribution: 'OpenWeatherMap'
    });

    const temperatureOverlay = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      attribution: 'OpenWeatherMap'
    });

    // NOTE: This is only for europe and part of north africa. (Also a little on south/north america)
    // https://www.arcgis.com/home/webmap/viewer.html?useExisting=1&layers=1b243539f4514b6ba35e7d995890db1d
    // arcGIS has a hillshading map that is world wide.
    const hillshadingMap = L.tileLayer(`http://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png	`, {
      attribution: 'OpenWeatherMap'
    });

    // Note: First add basemaps and add the overlay maps after, due to the fact that Leaflet doesn't load the overlaymaps otherwise.
    this.map.addOverlayMap('Clouds', cloudsOverlay);
    this.map.addOverlayMap('Precipitation', precipitationOverlay);
    this.map.addOverlayMap('Wind speed', windspeedOverlay);
    this.map.addOverlayMap('Temperature', temperatureOverlay);
    this.map.addOverlayMap('Hillshading', hillshadingMap);
  }

  public showAllAirstrips() {
    // The public method for showing all airstrips,
    // gathering them from the environmentally set airstrip json
    const airstripMarkers = this.createAirstripMarkerList(this.dataService.getAllAirstrips());
    this.showAirstrips(airstripMarkers);
  }

  public showRelevantAirstrips(): void {

    // It is possible for the selected flight to not be set.
    if (this.currentlySelectedFlight === undefined) {
      throw new NoFlightSelectedException();
    }

    const relevantAirstrips = this.dataService.getAirstripsByFlight(this.currentlySelectedFlight);

    // Create the marker list and show them on the screen
    const relevantAirstripMarkers = this.createAirstripMarkerList(relevantAirstrips);
    this.showAirstrips(relevantAirstripMarkers);
  }

  public plotFlight() {
    // It is possible for the selected flight to not be set.
    if (this.currentlySelectedFlight === undefined) {
      throw new NoFlightSelectedException();
    }

    const airstrips = this.dataService.getAirstripsByFlight(this.currentlySelectedFlight);

    const latLngList = [];

    airstrips.forEach(airstrip => {
      latLngList.push(Object.values(airstrip.position));
    });
    this.drawRoute(this.privateMap, latLngList as [[number, number]], this.currentlySelectedFlight.legs);
  }

  private drawRoute(map: WingmanMap, latLngList: [[number, number]], legList: Leg[]) {
    if (this.currentlyPlottedFlight !== undefined) {
      this.privateMap.removeLayer(this.currentlyPlottedFlight);
    }

    const legLines: L.Polyline[] = [];
    latLngList.forEach(latLng => {
    });

    for (let i = 0; i < latLngList.length - 1; i++) {

      const leg = L.polyline([latLngList[i], latLngList[i + 1]]);
      leg.bindPopup(this.getLegPopupContent(legList[i]));
      leg.on('mouseover', function(e) {
        this.openPopup();
      });
      legLines.push(leg);
    }
    const padding = 100;
    this.currentlyPlottedFlight = new L.FeatureGroup(legLines).addTo(map);
    map.fitBounds(this.currentlyPlottedFlight.getBounds(), { padding: new L.Point(padding, padding) });

  }

  private getLegPopupContent(leg: Leg){
    return `
      Take off time:
      Meeting time: <b>${leg.meetingTime}</b><br>
      Landing time: <b>${leg.landingTime}</b><br>
      Seats taken: <b>${leg.seatsTaken}/${leg.maxSeats}</b><br>
      Leg duration: <b>${leg.seatsTaken}/${leg.maxSeats}</b><br>
    `;
  }

  private drawPolygon(map: WingmanMap, latLngList: [[number, number]]) {
    if (this.currentlyPlottedFlight !== undefined) {
      this.privateMap.removeLayer(this.currentlyPlottedFlight);
    }

    this.currentlyPlottedFlight = L.polygon(latLngList, { color: 'red' }).addTo(map);
    const padding = 100;
    // map.panTo(flightPolygon.getBounds().getCenter());
    map.fitBounds(this.currentlyPlottedFlight.getBounds(), { padding: new L.Point(padding, padding) });

    // .on('moveend', (e) => {
    //   map.fitBounds(flightPolygon.getBounds());
    // });

    // console.log(flight);
  }

  // public drawLine(map: WingmanMap, latlng: [number, number]){
  //   const leafletLatLng = L.latLng(latlng[0], latlng[1]);
  //   L.draw(latlng, {color: 'red'});
  // })

  private showAirstrips(airstripMarkers: L.Marker[]): void {
    // Remove the current marker layer
    if (this.currentAirstripsGroup) {
      this.privateMap.removeLayer(this.currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this.currentAirstripsGroup = L.layerGroup(airstripMarkers);
    this.map.addLayer(this.currentAirstripsGroup);
  }

  private createAirstripMarkerList(airstrips: Airstrip[]): L.Marker[] {
    const waypointIcon = this.icons.waypoint;
    const airstripIcon = this.icons.airstrip;

    // Map all relevant data of the airstrip to the airstripArray
    const airstripMarkerArray = airstrips.map(airstrip => {
      const marker = L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? waypointIcon : airstripIcon }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(this.generateMarkerPopupContent(airstrip));
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      return marker;
    });
    return airstripMarkerArray;
  }

  private generateMarkerPopupContent(airstrip) {
    const type = airstrip.waypointOnly ? 'waypoint' : 'airstrip';

    const markerContent = `
    <h3>${airstrip.name} (${airstrip.displayName})</h3>
    <p>
      This is ` + (airstrip.mafBase ? `` : `<b>not</b>`) + ` a maf base.<br>
      Avgas is <b>` + (airstrip.avgasAvailable ? 'available' : 'unavailable') + `<br>
      </b> and jetA1 is <b>` + (airstrip.jetA1Available ? 'available' : 'unavailable') + `</b>.<br>
      ` + (airstrip.notes ? `Notes: ${airstrip.notes}` : ``) + `
    </p>`;

    return markerContent;
  }

}
