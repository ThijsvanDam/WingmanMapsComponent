import { NoFlightSelectedException } from './../shared/exceptions/no-flight-selected.exception';
import { TestBed } from '@angular/core/testing';

import * as L from 'leaflet';

// Services
import { WingmanDataService } from './wingman-data.service';
import { WingmanMapService } from './wingman-map.service';

// Models
import { Airstrip } from '../shared/models/airstrip.model';

import { WingmanMap } from './../dynamic-map/wingman-map';
import { environment } from 'src/environments/environment';

/**
 * Take a note that almost every test using mapService.map doesn't work properly.
 * This is because WingmanMap by default initializes the map using a DOM reference,
 * which isn't available in these tests.
 * At the moment of writing, Jasmine doesn't offer a proper solution to deal with this.
 */

describe('Wingman map service', () => {
  let mapService: WingmanMapService;
  let dataServiceSpy: jasmine.SpyObj<WingmanDataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('WingmanDataService', ['getAllAirstrips']);

    TestBed.configureTestingModule({
      providers: [WingmanMapService,
        { provide: WingmanDataService, useValue: spy }]
    });

    mapService = TestBed.inject(WingmanMapService);
    dataServiceSpy = TestBed.inject(WingmanDataService) as jasmine.SpyObj<WingmanDataService>;
  });

  it('Should be able to call showAirstrips with correctly created airstrip markers', () => {
    const latValue = 10;
    const longValue = 20;

    const allAirstrips: Airstrip[] = [{
      position: { latDeg: latValue, longDeg: longValue },
      waypointOnly: false,
      name: 'Mt Hagen'
    }];
    dataServiceSpy.getAllAirstrips.and.returnValue(allAirstrips);

    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    const markerList = [
      L.marker([latValue, longValue], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Mt Hagen`)
    ];

    mapService.showAllAirstrips();

    expect(showAirstripsSpy).toHaveBeenCalledWith(markerList);
  });


  it('Should have an undefined map when initializeMap has not been called yet', () => {

    expect(mapService.map).toBeUndefined();

    /**
     * Should be able to test this piece of code, though the spy doesnt seem to work.
     * Now only tests if it hasn't been initialized yet, if initializeMap hasn't been called yet.
     * WingmanMap causes this to error, because mapId isn't found.
     * https://stackoverflow.com/questions/22321673/jasmine-node-creating-a-spy-on-a-constructor-called-inside-other-function
     * Above stackoverflow gives information about a possible solution, though this
     * has no effect on cancelling the WingmanMap on initializing.
     */

    // let addLayersSpy = spyOn<any>(mapService, 'addLayers');
    // var Helpers = {
    //   WingmanMap: WingmanMap
    // };

    // var constSpy = spyOn<any>(Helpers, 'WingmanMap');

    // mapService.initializeMap('map');

    // expect(mapService.map).toBeDefined();
    // expect(addLayersSpy).toHaveBeenCalled();
  });


  it('Should not do anything when showing relevant airstrips if no flight is selected', () => {
    dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();

    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    try{
      mapService.showRelevantAirstrips();
    }catch (e){
      e.handleError('Could not get relevant airstrips');
    }
    /* Another expectation is that showRelevantAirstrips throws a NoFlightSelectedException
    ** except, for some reason the following does not work:
    ** expect(mapService.showRelevantAirstrips).toThrow(new NoFlightSelectedException());
    ** so, we will just check if the methods after the exception are getting called
    ** whether or not.
    */
    expect(dataServiceSpy.getAirstripsByIdList).not.toHaveBeenCalled();
    expect(showAirstripsSpy).not.toHaveBeenCalled();
  });

  it('Should call showAirstrips with correct AirstripMarkers with a given flight', () => {
    mapService.selectedFlight = {
      flightId: 'F1',
      legs: [
        {
          startId: 'A1',
          destinationId: 'A2'
        },
        {
          startId: 'B1',
          destinationId: 'B2'
        }
      ]
    };

    const expectedAirstripList = ['A1', 'A2', 'B1', 'B2'];

    const returnRelevantAirstrips: Airstrip[] = [
      {
        airstripId: 'A1',
        position: { latDeg: 10, longDeg: 20 },
        waypointOnly: false,
        name: 'Mt Hagen'
      },
      {
        airstripId: 'A2',
        position: { latDeg: 20, longDeg: 30 },
        waypointOnly: true,
        name: 'Mindirisjk'
      },
      {
        airstripId: 'B1',
        position: { latDeg: -20, longDeg: 50 },
        waypointOnly: false,
        name: 'Quatar'
      },
      {
        airstripId: 'B2',
        position: { latDeg: -1, longDeg: 3 },
        waypointOnly: false,
        name: 'Minsk'
      }
    ];

    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Mt Hagen`),
      L.marker([20, 30], { icon: mapService.icons.waypoint })
        .bindPopup(`This should be airstrip Mindirisjk`),
      L.marker([-20, 50], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Quatar`),
      L.marker([-1, 3], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Minsk`),
    ];


    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);

    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    mapService.showRelevantAirstrips();

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });

  it('Filter the airstripIDs of a given flight correctly', () => {
    mapService.selectedFlight = {
      flightId: 'F1',
      legs: [
        {
          startId: 'A1',
          destinationId: 'B2'
        },
        {
          startId: 'B2',
          destinationId: 'A1'
        }
      ]
    };

    const expectedAirstripList = ['A1', 'B2'];

    const returnRelevantAirstrips: Airstrip[] = [
      {
        airstripId: 'A1',
        position: { latDeg: 10, longDeg: 20 },
        waypointOnly: false,
        name: 'Mt Hagen'
      },
      {
        airstripId: 'B2',
        position: { latDeg: -1, longDeg: 3 },
        waypointOnly: false,
        name: 'Minsk'
      }
    ];

    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Mt Hagen`),
      L.marker([-1, 3], { icon: mapService.icons.airstrip })
        .bindPopup(`This should be airstrip Minsk`),
    ];

    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);

    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    mapService.showRelevantAirstrips();

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });
});
