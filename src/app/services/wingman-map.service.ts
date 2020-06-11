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

    const relevantAirstrips = this.dataService.getAirstripsByFlight(this.currentlySelectedFlight, true);

    // Create the marker list and show them on the screen
    const relevantAirstripMarkers = this.createAirstripMarkerList(relevantAirstrips);
    this.showAirstrips(relevantAirstripMarkers);
  }

  public plotFlight() {
    // It is possible for the selected flight to not be set.
    if (this.currentlySelectedFlight === undefined) {
      throw new NoFlightSelectedException();
    }

    const airstripsPairs: [[Airstrip, Airstrip]] = this.dataService.getLegAirstripPairByFlight(this.currentlySelectedFlight);

    const latLngList = [];

    const positionPairs = airstripsPairs.map(pair => [Object.values(pair[0].position), Object.values(pair[1].position)]);

    // airstrips.forEach(airstrip => {
    //   latLngList.push(Object.values(airstrip.position));
    // });

    this.drawRoute(this.privateMap, positionPairs as [[[number, number]]], this.currentlySelectedFlight.legs);
  }

  private drawRoute(map: WingmanMap, positionPairs: [[[number, number]]], legList: Leg[]) {
    if (this.currentlyPlottedFlight !== undefined) {
      this.privateMap.removeLayer(this.currentlyPlottedFlight);
    }

    const legLines: L.Polyline[] = [];
    positionPairs.forEach((pair, index) => {
      const leg = L.polyline(pair);
      
      leg.bindPopup(this.getLegPopupContent(legList[index]));
      leg.on('mouseover', function(e) {
        this.openPopup();
      });
      legLines.push(leg);
    });

    // for (let i = 0; i < latLngList.length - 1; i++) {

    // }
    const padding = 100;
    this.currentlyPlottedFlight = new L.FeatureGroup(legLines).addTo(map);
    map.fitBounds(this.currentlyPlottedFlight.getBounds(), { padding: new L.Point(padding, padding) });

  }

  private drawPolygon(map: WingmanMap, latLngList: [[number, number]]) {
    if (this.currentlyPlottedFlight !== undefined) {
      this.privateMap.removeLayer(this.currentlyPlottedFlight);
    }

    this.currentlyPlottedFlight = L.polygon(latLngList, { color: 'red' }).addTo(map);
    const padding = 100;

    map.fitBounds(this.currentlyPlottedFlight.getBounds(), { padding: new L.Point(padding, padding) });
  }

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
    let markerContent = '';

    markerContent += `<h3>${airstrip.name} (${airstrip.displayName})</h3>`;
    markerContent += `<p>`;

    if(airstrip.waypointOnly){
      markerContent += 'This is a marker!';
    }else{
      markerContent += `
      This is ` + (airstrip.mafBase ? `` : `<b>not</b>`) + ` a maf base.<br>
      Avgas is <b>` + (airstrip.avgasAvailable ? 'available' : 'unavailable') + `<br>
      </b> and jetA1 is <b>` + (airstrip.jetA1Available ? 'available' : 'unavailable') + `</b>.<br>
      ` + (airstrip.notes ? `Notes: ${airstrip.notes}` : ``);
    }

    markerContent += `</p>`;
    return markerContent;
  }

  private getLegPopupContent(leg: Leg){
    const meetingTime = new Date(leg.meetingTime);
    const landing = new Date(leg.landing);
    const takeoff = new Date(leg.takeoff);

    return `
      Meeting time: <b>${this.getDMYHM(meetingTime)}</b><br>
      Take off time: <b>${this.getDMYHM(takeoff)}</b><br>
      Landing time: <b>${this.getDMYHM(landing)}</b><br>
      Seats taken: <b>${leg.seatsTaken}/${leg.maxSeats}</b><br>
      Leg duration: <b>${leg.airTime}</b><br>
    `;
  }

  private getDMYHM(date: Date): string{
    return (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ' ' +
    date.getDay() + '/' +
    date.getMonth() + '/' +
    date.getFullYear();
  }
}
