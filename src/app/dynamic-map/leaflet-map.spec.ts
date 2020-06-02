import { async } from '@angular/core/testing';
import { } from 'jasmine';

import { WingmanMap } from './leaflet-map';
import { DynamicMapComponent } from './dynamic-map.component';



class Map{
  _on() {}
}

class MockLeafletMap {

  _map = new Map();

  addLayer() { }

  removeLayer() { }

  addTileLayer() {}

  addOverlay() {}

  addBaseLayer() {}
}

class Marker { }


describe('WingmanMap', () => {

  beforeEach(() => {

  });

  it('should create markers and show the markers when showAllAirstrips is called', () => {
    const mapMock = new MockLeafletMap();

    const wingmanMap = new WingmanMap(mapMock);
    const markerList = [new Marker(), new Marker()];
    const spiedAirstripMarkerList = spyOn<any>(wingmanMap, 'createAirstripMarkerList').and.returnValue(markerList);
    const spiedShowAirstrips = spyOn<any>(wingmanMap, 'showAirstrips');

    wingmanMap.showAllAirstrips();

    expect(spiedAirstripMarkerList).toHaveBeenCalledWith(require('../../assets/json/airstrips.json'));
    expect(spiedShowAirstrips).toHaveBeenCalledWith(markerList);
  });

  it('should only show the airstrips given by the flight legs', () => {
    const flightJson =
    {
      flightId: 'FPG035200',
      legs: [
        {
          startId: 'AS000052',
          destinationId: 'AS000180'
        },
        {
          startId: 'AS000394',
          destinationId: 'AS000052'
        },
        {
          startId: 'AS000180',
          destinationId: 'AS000394'
        },
      ]
    };

    const airstrips = [
      {
        airstripId: 'AS000052',
        displayName: 'BM',
        name: 'Balimo',
        waypointOnly: false,
        airstripClosed: false,
        mafBase: false,
        country: 'PG',
        active: true,
        countryId: 'C000148',
        position: {
          latDeg: -8.050333,
          longDeg: 142.941162
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: false,
        jetA1Available: false,
        departureTaxApplies: false
      },
      {
        airstripId: 'AS000180',
        displayName: 'GA',
        name: 'Goroka',
        waypointOnly: false,
        airstripClosed: false,
        mafBase: true,
        country: 'PG',
        active: true,
        countryId: 'C000148',
        position: {
          latDeg: -6.082667,
          longDeg: 145.391327
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: true,
        jetA1Available: true,
        departureTaxApplies: false
      },
      {
        airstripId: 'AS000394',
        displayName: 'MH',
        name: 'Mount Hagen',
        waypointOnly: false,
        airstripClosed: false,
        mafBase: true,
        country: 'PG',
        active: true,
        countryId: 'C000148',
        position: {
          latDeg: -5.829,
          longDeg: 144.3005
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: true,
        jetA1Available: true,
        departureTaxApplies: false
      }
    ];

    const mapMock = new MockLeafletMap();

    const wingmanMap = new WingmanMap(mapMock);

    const spyMarkerList = spyOn<any>(wingmanMap, 'createAirstripMarkerList');

    wingmanMap.showRelevantAirstrips(flightJson);
    expect(spyMarkerList).toHaveBeenCalledWith(airstrips);
  });

});