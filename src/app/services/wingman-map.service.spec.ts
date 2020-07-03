import { CookieService } from './cookie.service';
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
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  const mouseFunction = function (e) {
    this.openPopup();
  };

  beforeEach(() => {
    // const spy = jasmine.createSpyObj('WingmanDataService', ['getAllAirstrips'], {
      // currentlySelectedFlights: new BehaviorSubjectMock()
    // });

    // spy.currentlySelectedFlights.and.returnValue(new BehaviorSubjectMock());
    
    // { provide: WingmanDataService, useValue: spy },
    TestBed.configureTestingModule({
      providers: [WingmanMapService,
                  WingmanDataService,
                  CookieService,
      ]
    });

    // Inject the services and make the dataservice spyable.
    mapService = TestBed.inject(WingmanMapService);
    dataServiceSpy = TestBed.inject(WingmanDataService) as jasmine.SpyObj<WingmanDataService>;
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  const markerAddMethods = (marker, popupValue = `Test return message`, tooltipValue = `display`) => {
    return marker
    .bindPopup(popupValue)
    .on('mouseover', mouseFunction)
    .on('mouseout', mouseFunction)
    .bindTooltip(tooltipValue, { permanent : true });
  };

  it('Should be able to call showAirstrips with correctly created airstrip markers', () => {
    // Make these values comparable by inputting and expecting them.
    const latValue = 10;
    const longValue = 20;

    // All the airstrips that we are going to return from the dataService.
    const allAirstrips: Airstrip[] = [{
      displayName: 'display',
      position: { latDeg: latValue, longDeg: longValue },
      waypointOnly: false,
      name: 'Mt Hagen'
    }];
    spyOn(dataServiceSpy, 'getAllAirstrips').and.returnValue(allAirstrips);
    // This should be the markerlist result the showAirstripsSpy should be called with
    const expectedMarkerList = [
      markerAddMethods(L.marker([latValue, longValue], { icon: mapService.icons.airstrip }), `Test return message`, `display`)
    ];

    // Setting the spies required for this test
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');
    spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');

    // Exeute the code we want to test
    mapService.showAllAirstrips();

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseFunction;
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseout[0].fn = mouseFunction;
    }

    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });

  it('Should call showAirstrips with correct AirstripMarkers with a given flight', () => {
    // This is all the flight data needed by the function,
    // calling showRelevantAirstrips will not need more data.
    spyOn(mapService, 'initializeMap').and.callFake(function(mapId) {
      this.dataService.currentlySelectedFlights.subscribe(data => this.drawFlightsAndMarkers(data));
    });

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
        displayName: `display`,
        airstripId: 'A1',
        position: { latDeg: 10, longDeg: 20 },
        waypointOnly: false,
        name: 'Mt Hagen'
      },
      {
        displayName: `display`,
        airstripId: 'A2',
        position: { latDeg: 20, longDeg: 30 },
        waypointOnly: true,
        name: 'Mindirisjk'
      },
      {
        displayName: `display`,
        airstripId: 'B1',
        position: { latDeg: -20, longDeg: 50 },
        waypointOnly: false,
        name: 'Quatar',
        mafBase: true
      },
      {
        displayName: `display`,
        airstripId: 'B2',
        position: { latDeg: -1, longDeg: 3 },
        waypointOnly: false,
        name: 'Minsk'
      }
    ];

    // Create the expected values, with a custom popupmessage.
    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip }),
      L.marker([20, 30], { icon: mapService.icons.waypoint }),
      L.marker([-20, 50], { icon: mapService.icons.maf_base }),
      L.marker([-1, 3], { icon: mapService.icons.airstrip }),
    ];

    // Give each each expected marker a mouseoverfunction manually.
    // This is required to make the markerlist comparable to the
    // markerlist showAirstrips is called with.
    expectedMarkerList.forEach(marker => {
      markerAddMethods(marker, `Test return message`, `display`);
    });

    // Creating all spies
    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);
    spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    // Execute our actual code
    mapService.initializeMap('mapId');

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseFunction;
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseout[0].fn = mouseFunction;
    }

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });

  it('Filter the airstripIDs of a given flight correctly', () => {
    // This is all the flight data needed by the function,
    // calling showRelevantAirstrips will not need more data.
    spyOn(mapService, 'initializeMap').and.callFake(function(mapId) {
      this.dataService.currentlySelectedFlights.subscribe(data => this.drawFlightsAndMarkers(data));
    });

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
        displayName: 'display',
        airstripId: 'A1',
        position: { latDeg: 10, longDeg: 20 },
        waypointOnly: false,
        name: 'Mt Hagen'
      },
      {
        displayName: 'display',
        airstripId: 'B2',
        position: { latDeg: -1, longDeg: 3 },
        waypointOnly: false,
        name: 'Minsk'
      }
    ];

    // Create the expected values, with a custom popupmessage.
    const expectedMarkerList = [
      L.marker([10, 20], { icon: mapService.icons.airstrip }),
      L.marker([-1, 3], { icon: mapService.icons.airstrip }),
    ];

    expectedMarkerList.forEach(marker => {
      markerAddMethods(marker, `Test return message`, `display`);
    });

    // Create spies for all external functions that showRelevantAirstrips calls,
    // only the onses that aren't tested individually!
    const idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnRelevantAirstrips);
    spyOn<any>(mapService, 'generateMarkerPopupContent').and.returnValue('Test return message');
    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    // Execute our actual code
    mapService.initializeMap('mapId');

    // This replaces the mouseOverFunction with a local one because there is no proper way
    // to get the function that is created inside the createAirstripMarkerList function.
    for (let i = 0; i < expectedMarkerList.length; i++) {
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseover[0].fn = mouseFunction;
      showAirstripsSpy.calls.argsFor(0)[0][i]._events.mouseout[0].fn = mouseFunction;
    }

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList);
    expect(showAirstripsSpy).toHaveBeenCalledWith(expectedMarkerList);
  });
});
