import { TestBed } from '@angular/core/testing';

import * as L from 'leaflet';

// Services
import { WingmanDataService } from './wingman-data.service';
import { WingmanMapService } from './wingman-map.service';

// Models
import { Airstrip } from '../shared/models/airstrip.model';

/**
 * Take a note that almost every test using mapService.map doesn't work properly.
 * This is because WingmanMap by default initializes the map using a DOM reference,
 * which isn't available in these tests.
 * At the moment of writing, Jasmine doesn't offer a proper solution to deal with this.
 */

describe('Wingman map service', () => {
  // Make the services available for all tests
  let mapService: WingmanMapService;
  // Note that the dataService return value is set in each test,
  // so that the data is managable and expected inside each test.
  let dataServiceSpy: jasmine.SpyObj<WingmanDataService>;

  const mouseOverFunction = function(e) {
    this.openPopup();
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('WingmanDataService', ['getAllAirstrips']);

    TestBed.configureTestingModule({
      providers: [WingmanMapService,
        { provide: WingmanDataService, useValue: spy }]
    });

    // Inject the services and make the dataservice spyable.
    mapService = TestBed.inject(WingmanMapService);
    dataServiceSpy = TestBed.inject(WingmanDataService) as jasmine.SpyObj<WingmanDataService>;
  });

  it('Should be able to call showAirstrips with correctly created airstrip markers', () => {
    // Make these values comparable by inputting and expecting them.
    const latValue = 10;
    const longValue = 20;

    // All the airstrips that we are going to return from the dataService.
    const allAirstrips: Airstrip[] = [{
      position: { latDeg: latValue, longDeg: longValue },
      waypointOnly: false,
      name: 'Mt Hagen'
    }];
    dataServiceSpy.getAllAirstrips.and.returnValue(allAirstrips);

    // This should be the markerlist result the showAirstripsSpy should be called with
    const expectedMarkerList = [
      L.marker([latValue, longValue], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`).on('mouseover', mouseOverFunction)
    ];

    // Setting the spies required for this test
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');
    spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');

    // Exeute the code we want to test
    mapService.showAllAirstrips();

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseOverFunction;
    }

    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
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

    try {
      mapService.showRelevantAirstripMarkers();
    } catch (e) {
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
    // This is all the flight data needed by the function,
    // calling showRelevantAirstrips will not need more data.
    mapService.selectedFlights = [{
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
    }];

    // With the selected flight, these should be the expected airstrips.
    const expectedAirstripList = ['A1', 'A2', 'B1', 'B2'];

    // These should be the airstrips that are returned by the data service
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

    // Create the expected values, with a custom popupmessage.
    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`),
      L.marker([20, 30], { icon: mapService.icons.waypoint })
        .bindPopup(`Test return message`),
      L.marker([-20, 50], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`),
      L.marker([-1, 3], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`),
    ];

    // Give each each expected marker a mouseoverfunction manually.
    // This is required to make the markerlist comparable to the
    // markerlist showAirstrips is called with.
    expectedMarkerList.forEach(markerList => {
      markerList.on('mouseover', mouseOverFunction);
    });

    // Creating all spies
    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);
    const generateMarkerPopupSpy = spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    // Execute our actual code
    mapService.showRelevantAirstripMarkers();

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseOverFunction;
    }

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });

  it('Filter the airstripIDs of a given flight correctly', () => {
    // This is all the flight data needed by the function,
    // calling showRelevantAirstrips will not need more data.
    mapService.selectedFlights = [{
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
    }];

    // With the selected flight, these should be the expected airstrips.
    const expectedAirstripList = ['A1', 'B2'];

    // These should be the airstrips that are returned by the data service
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

    // Create the expected values, with a custom popupmessage.
    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`),
      L.marker([-1, 3], { icon: mapService.icons.airstrip })
        .bindPopup(`Test return message`),
    ];

    expectedMarkerList.forEach(markerList => {
      markerList.on('mouseover', mouseOverFunction);
    });

    // Create spies for all external functions that showRelevantAirstrips calls,
    // only the onses that aren't tested individually!
    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);
    const generateMarkerPopupSpy = spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    // Execute our actual code
    mapService.showRelevantAirstripMarkers();

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseOverFunction;
    }

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });
});