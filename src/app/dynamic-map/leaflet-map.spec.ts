import { LeafletMap } from './leaflet-map';
import { async, TestBed } from '@angular/core/testing';
import {} from 'jasmine';

describe('LeafletMap', () => {

  let map: LeafletMap;


  beforeEach(() => {
    map = new LeafletMap();
  });

  it('should only show the airstrips given by the flight legs', () => {
    let flightJson = [
      {
        "flightId": "FPG035200",
        legs: [
          {
            "startId": "AS000394",
            "destinationId": "AS000052"
          },
          {
            "startId": "AS000052",
            "destinationId": "AS000180"
          },
          {
            "startId": "AS000180",
            "destinationId": "AS000394"
          },
        ]
      },
    ];

    map.showRelevantAirstrips(flightJson);
    
    map.getMap().eachLayer(function (layer) { 
     console.log(layer);
    });
  });


});