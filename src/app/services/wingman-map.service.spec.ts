import { TestBed } from '@angular/core/testing';

import * as L from 'leaflet';

// Services
import { WingmanDataService } from './wingman-data.service';
import { WingmanMapService } from './wingman-map.service';

// Models
import { Airstrip } from '../shared/models/airstrip.model';

import { WingmanMap } from './../dynamic-map/wingman-map';
import { environment } from 'src/environments/environment';


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

  it('Should be able to call showAirstrips with correctly created markers', () => {
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
      L.marker([latValue, longValue], {icon: mapService.icons.airstrip})
      .bindPopup(`This should be airstrip Mt Hagen`)
    ];

    mapService.showAllAirstrips();

    expect(showAirstripsSpy).toHaveBeenCalledWith(markerList);
  });

  it('Should not do anything when showing relevant airstrips if no flight is selected', () => {
    dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();

    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    const returnValue = mapService.showRelevantAirstrips();

    expect(returnValue).toBe(0);
    expect(dataServiceSpy.getAirstripsByIdList).not.toHaveBeenCalled();
    expect(showAirstripsSpy).not.toHaveBeenCalled();
  });

  it('Should call showAirstrip with correct AirstripMarkers', () => {
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

    const returnAirstrips = [
      {
        airstripId: 'A1'
      },
      {
        airstripId: 'A2'
      },
      {
        airstripId: 'B1'
      },
      {
        airstripId: 'B2'
      }
    ];

    const spyMarkerList = spyOn<any>(mapService, 'createAirstripMarkerList');


    let idListSpy = dataServiceSpy.getAirstripsByIdList = jasmine.createSpy();
    idListSpy.and.returnValue(returnAirstrips);


    const showAirstripsSpy = spyOn<any>(mapService, 'showAirstrips');

    mapService.showRelevantAirstrips();

    expect(idListSpy).toHaveBeenCalledWith(expectedAirstripList)
    expect(showAirstripsSpy).toHaveBeenCalledWith(returnAirstrips);
  });


  // it('Should be able to create a marker list for a given airstrip', () => {

  // });

});