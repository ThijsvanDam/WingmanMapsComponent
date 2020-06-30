import { Injectable } from '@angular/core';

// Downloaded from https://github.com/MazeMap/Leaflet.TileLayer.PouchDBCached
import * as L from 'leaflet';
import 'src/assets/javascript/L.TileLayer.PouchDBCached.js';

import { environment } from './../../environments/environment';

import { WingmanDataService } from './wingman-data.service';
import { CookieService } from './cookie.service';

import { Flight } from './../shared/models/flight.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Leg } from './../shared/models/leg.model';

import { WingmanMap } from '../components/map/wingman-map';

/**
 * The injectable wingman map service.
 * This service contains all map logic.
 * @note this is dependent on the leaflet library.
 */
@Injectable()
export class WingmanMapService {
  public icons;
  private privateMap: WingmanMap;

  private currentlySelectedFlights: Flight[];
  private currentAirstripsGroup: L.FeatureGroup;
  private currentlyDrawnGroup: any;

  constructor(private dataService: WingmanDataService, private cookieService: CookieService) {

    this.icons = {
      airstrip: L.icon({
        iconUrl: environment.marker.airstrip_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      }),
      waypoint: L.icon({
        iconUrl: environment.marker.waypoint_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -15]
      }),
      maf_base: L.icon({
        iconUrl: environment.marker.maf_base_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      }),

    };

    this.currentlySelectedFlights = [];
  }

  /**
   * Initialize the map, create a WingmanMap instance, adds the layers and controls and subscribes to the observable.
   * This method makes it possible to load the map after the HTML has been loaded.
   */
  public initializeMap(mapId) {
    this.map = new WingmanMap(this.cookieService, mapId, {
      center: [51.505, -0.09],
      zoom: 13
    });
    this.addLayersAndControls();
    this.dataService.currentlySelectedFlights.subscribe(data => this.drawFlightsAndMarkers(data));
  }

  public set map(wingmanMap) {
    this.privateMap = wingmanMap;
  }

  public get map() {
    return this.privateMap;
  }

  /**
   * Set the currently selected flight of the map.
   * Note: This will call next on the selected flight observable, providing
   * the selected flight to each subscriber!
   */
  public set selectedFlights(flights: Flight[]) {
    this.dataService.currentlySelectedFlights.next(flights);
  }

  /**
   * Method for the flights observable to hook into, providing all logic to set the new state of the map.
   * This method is to be used by the observable only, because it uses the private currentlySelectedFlights
   * in stead of the public selectedFlights property.
   */
  private drawFlightsAndMarkers(flights) {
    this.currentlySelectedFlights = flights;
    this.showRelevantAirstripMarkers();
    this.drawFlights(this.currentlySelectedFlights);
  }

  /**
   * Adds all  layers and controls to the private map using the WingmanMap class
   * This is the place to add new layers!
   * Note: First add basemaps and add the overlay maps after, due to the fact that Leaflet doesn't load the overlaymaps otherwise.
   */
  private addLayersAndControls() {
    const OWM_KEY = environment.api_keys.openweathermap;

    // Add all base maps:
    const topographicMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      useCache: true,
      crossOrigin: true,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satelliteMap = L.tileLayer(`http://{s}.sat.owm.io/sql/{z}/{x}/{y}/?appid=${OWM_KEY}&overzoom=true&op=rgb&from=cloudless&select=b4,b3,b2`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'vane?'
    });

    const blackWhiteMap = L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      useCache: true,
      crossOrigin: true,
      attribution: ''
    });

    const watercolor = L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg	', {
      useCache: true,
      crossOrigin: true,
      attribution: ''
    });

    this.map.addBaseMap('Topographic map', topographicMap, { enable: true });
    this.map.addBaseMap('Sat map', satelliteMap);
    this.map.addBaseMap('Black white', blackWhiteMap);
    this.map.addBaseMap('Water color', watercolor);

    // Add all overlay maps:
    const cloudsOverlay = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    const precipitationOverlay = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    const windspeedOverlay = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    const temperatureOverlay = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    // NOTE: This is only for europe and part of north africa. (Also a little on south/north america)
    // https://www.arcgis.com/home/webmap/viewer.html?useExisting=1&layers=1b243539f4514b6ba35e7d995890db1d
    // arcGIS has a hillshading map that is world wide.
    const hillshadingMap = L.tileLayer(`http://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png`, {
      useCache: true,
      crossOrigin: true,
      attribution: 'OpenWeatherMap'
    });

    this.map.addOverlayMap('Clouds', cloudsOverlay);
    this.map.addOverlayMap('Precipitation', precipitationOverlay);
    this.map.addOverlayMap('Wind speed', windspeedOverlay);
    this.map.addOverlayMap('Temperature', temperatureOverlay);
    this.map.addOverlayMap('Hillshading', hillshadingMap);

    // Make the map cache data on changes.
    this.map.saveMapSettingsOnChange();

    // Add a control for the airstrip labels using an extended label control class.
    this.map.addOverlayMap('Airstrip labels', new LabelControlLayer(), { enable: true });
  }
  /**
   * Show leaflet markers for all airstrips.
   */
  public showAllAirstrips() {
    // The public method for showing all airstrips,
    // gathering them from the data service.
    const airstripMarkers = this.createAirstripMarkerList(this.dataService.getAllAirstrips());
    this.showAirstrips(airstripMarkers);
  }

  /**
   * Show leaflet markers according to the currently selected flights.
   */
  public showRelevantAirstripMarkers(): void {
    let airstripIdList = [];
    this.currentlySelectedFlights.forEach(flight => {
      flight.legs.forEach(leg => {
        airstripIdList.push(leg.startId);
        airstripIdList.push(leg.destinationId);
      });
    });

    // There are many duplicates because obviously the airstrips that are visited often
    // exist in multiple flights.
    airstripIdList = airstripIdList.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    const airstripList = this.dataService.getAirstripsByIdList(airstripIdList);
    const markerList = this.createAirstripMarkerList(airstripList);

    this.showAirstrips(markerList);
  }

  /**
   * Adds a leaflet featuregroup to the map for all passed through leaflet markers.
   * @param airstripMarkers list of all the leaflet markers that need to be shown on the map
   */
  private showAirstrips(airstripMarkers: L.Marker[]): void {
    // Remove the current marker layer
    if (this.currentAirstripsGroup) {
      this.privateMap.removeLayer(this.currentAirstripsGroup);
    }

    // Add the marker layer to the map and save the layer to the LeafletMap.
    this.currentAirstripsGroup = L.featureGroup(airstripMarkers);

    this.map.addLayer(this.currentAirstripsGroup);
  }

  /**
   * Creates leaflet markers according to the passed through airstrips.
   * @param airstrips A list of airstrips according to Wingman
   * @returns Leaflet marker list
   */
  private createAirstripMarkerList(airstrips: Airstrip[]): L.Marker[] {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripMarkerArray = airstrips.map(airstrip => {

      let icon;
      if (Boolean(airstrip.waypointOnly)) {
        icon = this.icons.waypoint;
      } else if (airstrip.mafBase) {
        icon = this.icons.maf_base;
      } else {
        icon = this.icons.airstrip;
      }
      const marker = L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(this.generateMarkerPopupContent(airstrip));

      marker.bindTooltip(airstrip.displayName, { permanent: true });

      marker.on('mouseover', function(e) {
        this.openPopup();
      });

      marker.on('mouseout', function(e) {
        this.closePopup();
      });

      return marker;
    });
    return airstripMarkerArray;
  }

  /**
   * Generate the content of the airstrip marker on the leaflet map.
   * @param airstrip Airstrip to gather data from, expected to have a
   * name, displayName, mafBase, avgasAvailable, jetA1Available and notes property
   */
  private generateMarkerPopupContent(airstrip) {
    let markerContent = '';

    markerContent += `<h3>${airstrip.name} (${airstrip.displayName})</h3>`;
    markerContent += `<p>`;

    if (airstrip.waypointOnly) {
      markerContent += 'This is a waypoint.';
    } else {
      markerContent += `
      This is ` + (airstrip.mafBase ? `` : `<b>not</b>`) + ` a maf base.<br>
      Avgas is <b>` + (airstrip.avgasAvailable ? 'available' : 'unavailable') + `<br>
      </b> and jetA1 is <b>` + (airstrip.jetA1Available ? 'available' : 'unavailable') + `</b>.<br>
      ` + (airstrip.notes ? `Notes: ${airstrip.notes}` : ``);
    }

    markerContent += `</p>`;
    return markerContent;
  }


  /**
   * Generate L.polylines for each flight inside an L.featureGroup.
   * This will automatically be added to the map.
   * The map must be known locally inside the service under this.privateMap.
   * @param flights the flights that have to be drawn
   */
  private drawFlights(flights: Flight[]) {
    // drawFlights implies that the current flights have to be removed.
    if (this.currentlyDrawnGroup !== undefined) {
      this.privateMap.removeLayer(this.currentlyDrawnGroup);
    }

    // Create a featuregroup of featuregroups.
    // For every flight a separate featuregroup is created.
    // This way information about each leg is stored separately
    // and the legs combined can be considered as one big group,
    // thus being able to change the bounds and zoom of the map accordingly.
    const routes: L.FeatureGroup[] = [];

    flights.forEach((flight) => {
      const flightLineGroup = this.getFlightLineGroup(flight);

      // The popup has to be added to the leg.
      // This is done right here, because both the flight information and the leaflet feature group are available in this scope.
      let count = 0;
      flightLineGroup.eachLayer(leg => {
        leg.bindPopup(this.getLegPopupContent(flight.legs[count], count + 1, flight));
        leg.on('click', function(e) {
          this.openPopup();
        });
        count++;
      });

      routes.push(flightLineGroup);
    });

    // Set the bounds regardless of the amount of groups or shape/bounds
    // of the selected legs.
    // The focus is on modularity.
    if (flights.length > 0) {
      this.currentlyDrawnGroup = L.featureGroup(routes);
      this.currentlyDrawnGroup.addTo(this.privateMap);
      const padding = 50;
      this.privateMap.fitBounds(this.currentlyDrawnGroup.getBounds(), { padding: new L.Point(padding, padding) });
    }
  }

  /**
   * Generates an array with 2 numbers, representing lat/long, for each Leg of each Flight.
   * [[[number, number]]]
   * \\\_ this is the lat/long list of a leg
   *  \\_ this iteration represents the leg
   *   \_ this iteration represents a flight
   * @returns a three-dimensional list with lat/long positions.
   */
  private getLatLongFromFlight(flight: Flight): [[[number, number]]] {
    const airstripsPairs: [[Airstrip, Airstrip]] = this.dataService.getAirstripPairsByFlight(flight);

    const positionPairs = airstripsPairs.map(pair => [Object.values(pair[0].position), Object.values(pair[1].position)]);

    return positionPairs as [[[number, number]]];
  }

  /**
   * Return leaflet polylines according to the position pairs.
   * This method only works with Wingman data.
   * It requires a list of a lat and long number for each leg, for each flight.
   * Create one polyline for each single line, so that the legs can have separate popups.
   * @param positionPairs a three-dimensional list considering flights, their legs and the lat/long locations of those legs.
   * @returns a list of leaflet polylines
   */
  private getPolyLines(positionPairs: [[[number, number]]]): L.Polyline[] {

    const legLines: L.Polyline[] = [];
    positionPairs.forEach((pair, index) => {
      const leg = L.polyline(pair);

      leg.setStyle({ color: '#2196F3', weight: 3 });
      legLines.push(leg);
    });

    return legLines;
  }

  /**
   * Get a leaflet featuregroup of lines according to flight legs.
   * @param flight Flight containing the legs that have to be drawn.
   * @returns a leaflet featuregroup of lines according to flight legs
   */
  private getFlightLineGroup(flight: Flight): L.FeatureGroup {
    // Get  the lat/longs from the airstrips flight legs.
    const positionPairs = this.getLatLongFromFlight(flight);

    // Create leaflet polylines and add them to a feature group.
    // The legs can now be addressed separately.
    const lineGroup = new L.FeatureGroup(this.getPolyLines(positionPairs));

    // Make an entire flight change color on mouse hover.
    lineGroup.on('mouseover', function(e) {
      this.setStyle({ color: '#ffa500', weight: 6 });
    }).on('mouseout', function(e) {
      this.setStyle({ color: '#2196F3', weight: 3 });
    });

    return lineGroup;
  }


  /**
   * Generate the content of the leg popup on the leaflet map.
   * There is quite a lot of data needed to show it.
   * @param currentLeg with the property meetingTime, landing, takeoff, seatsTaken, maxSeats and airTime
   * @param count count of the current legs according to the entire flight
   * @param flight with the property flightId, route and a list of legs
   */
  private getLegPopupContent(currentLeg: Leg, count: number, flight: Flight) {
    const meetingTime = new Date(currentLeg.meetingTime);
    const landing = new Date(currentLeg.landing);
    const takeoff = new Date(currentLeg.takeoff);

    return `
      <h3>Flight ${flight.flightId}</h3>
      ${flight.route}<br>
      This is leg <b>   ${count} of ${flight.legs.length}</b><br>
      Meeting time: <b> ${this.getDMYHMString(meetingTime)}</b><br>
      Take off time: <b>${this.getDMYHMString(takeoff)}</b><br>
      Landing time: <b> ${this.getDMYHMString(landing)}</b><br>
      Seats taken: <b>  ${currentLeg.seatsTaken}/${currentLeg.maxSeats}</b><br>
      Leg duration: <b> ${currentLeg.airTime}</b><br>
    `;
  }

  /**
   * Parses a date to a readable format for the user.
   * Currently HH:MM DD:MM:YYYY
   * @param date The date to be parsed
   * @returns a readable string with date information
   */
  private getDMYHMString(date: Date): string {
    // Force that the time is always double digit.
    // This isn't needed for the days.
    return (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
      (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ' ' +
      date.getDay() + '/' +
      date.getMonth() + '/' +
      date.getFullYear();
  }
}

const LabelControlLayer = L.Layer.extend({

  getElement(): HTMLElement {
    return document.getElementsByClassName('leaflet-tooltip-pane')[0] as HTMLElement;
  },

  initialize() {
    // onAdd will automatically be called when this is enabled and this is saved in the cookies
    // onRemove will obviously not be called when the labels are disabled and this is saved in the cookies.
    // By setting the pane display to none, it will be still enabled after reload.
    this.getElement().style.display = 'none';
  },
  onAdd() {
    // This will be automatically called when the option is cached.
    this.getElement().style.display = 'block';
  },
  onRemove() {
    this.getElement().style.display = 'none';
  }
});
