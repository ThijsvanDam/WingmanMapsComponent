import { TestBed } from '@angular/core/testing';

import { Airstrip } from './../shared/models/airstrip.model';

import { WingmanDataService } from './wingman-data.service';

describe('Wingman data service', () => {
  let dataService: WingmanDataService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [WingmanDataService]
    });

    dataService = TestBed.inject(WingmanDataService);
  });


  it('Should be able to only return the airstrips from the ID list', () => {

    const idList: string[] = ['AS000130', 'AS000137', 'AS000159'
    ];

    const expectedAirstrips: Airstrip[] = [
      {
        airstripId: 'AS000130',
        displayName: 'DMN',
        name: 'Dodomona',
        waypointOnly: false,
        airstripClosed: false,
        mafBase: false,
        country: 'PG',
        active: true,
        countryId: 'C000148',
        position: {
          latDeg: -6.24286652,
          longDeg: 142.617477
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: false,
        jetA1Available: false,
        departureTaxApplies: false
      },
      {
        airstripId: 'AS000137',
        displayName: 'EF',
        name: 'Efogi',
        waypointOnly: false,
        airstripClosed: true,
        mafBase: false,
        country: 'PG',
        active: false,
        countryId: 'C000148',
        position: {
          latDeg: -9.153,
          longDeg: 147.660172
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: false,
        jetA1Available: false,
        departureTaxApplies: false
      },
      {
        airstripId: 'AS000159',
        displayName: 'FK',
        name: 'Foroko',
        waypointOnly: false,
        airstripClosed: true,
        mafBase: false,
        country: 'PG',
        active: false,
        countryId: 'C000148',
        position: {
          latDeg: -5.3285,
          longDeg: 144.894165
        },
        preFlightTaxiTime: null,
        postFlightTaxiTime: null,
        meetingTimeAdvance: null,
        avgasAvailable: false,
        jetA1Available: false,
        departureTaxApplies: false
      }
    ];

    const retrievedAirstrips: Airstrip[] = dataService.getAirstripsByIdList(idList);

    expect(expectedAirstrips).toEqual(retrievedAirstrips);
  });

});
