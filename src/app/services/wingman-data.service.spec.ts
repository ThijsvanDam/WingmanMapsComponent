import { TestBed } from '@angular/core/testing';

import { Airstrip } from './../shared/models/airstrip.model';

import { WingmanDataService } from './wingman-data.service';
import { Aircraft } from '../shared/models/aircraft.model';
import { Flight } from '../shared/models/flight.model';

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

  it('Should be able gather an airstrip by its ID', () => {
    const expectedAirstrip =
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
    };

    const retrievedAirstrip: Aircraft = dataService.getAirstripById(expectedAirstrip.airstripId);

    expect(retrievedAirstrip).toEqual(expectedAirstrip);
  });

  it('Should be able gather an aircraft by its ID', () => {
    const expectedAircraft = {
      aircraftId: 'AC000033',
      displayName: 'MAF',
      aircraftType: 'C208',
      aircraftTypeId: 'AT000002',
      homeBase: 'PNG',
      registrationNo: 'P2-MAF',
      active: true,
      maxSeats: 9,
      bow: '2322 kg',
      mtow: '3792 kg',
      mlw: '3792 kg',
      mrw: '3792 kg',
      mzfw: '3792 kg',
      bas: '145 kts',
      fuelGaugesUnit: 2,
      fuelType: 1,
      fbr: '328 Pound JETA1',
      climbFuel: '26 Pound JETA1',
      taxiFuel: '28 Pound JETA1',
      fuelCapacity: '2229 Pound JETA1',
      fuelReserve: 0.9,
      meterType: 0,
      crewRequired: 1,
      v2TrackUnitName: 'MAF',
      departureDelay: null,
      arrivalDelay: null
    };

    const retrievedAircraft: Aircraft = dataService.getAircraftById(expectedAircraft.aircraftId);

    expect(retrievedAircraft).toEqual(expectedAircraft);
  });

  it('Should be able to get aircrafts by flight list', () => {
    const flightList: Flight[] = [
      {
        flightId: 'FPG034707',
        aircraftId: 'AC000033',
      },
      {
        flightId: 'FPG034664',
        aircraftId: 'AC000027',
      }
    ];

    const expectedAircrafts: Aircraft[] = [
      {
        aircraftId: 'AC000033',
        displayName: 'MAF',
        aircraftType: 'C208',
        aircraftTypeId: 'AT000002',
        homeBase: 'PNG',
        registrationNo: 'P2-MAF',
        active: true,
        maxSeats: 9,
        bow: '2322 kg',
        mtow: '3792 kg',
        mlw: '3792 kg',
        mrw: '3792 kg',
        mzfw: '3792 kg',
        bas: '145 kts',
        fuelGaugesUnit: 2,
        fuelType: 1,
        fbr: '328 Pound JETA1',
        climbFuel: '26 Pound JETA1',
        taxiFuel: '28 Pound JETA1',
        fuelCapacity: '2229 Pound JETA1',
        fuelReserve: 0.9,
        meterType: 0,
        crewRequired: 1,
        v2TrackUnitName: 'MAF',
        departureDelay: null,
        arrivalDelay: null
      },
      {
        aircraftId: 'AC000027',
        displayName: 'MAH',
        aircraftType: 'C208',
        aircraftTypeId: 'AT000002',
        homeBase: 'PNG',
        registrationNo: 'P2-MAH',
        active: true,
        maxSeats: 9,
        bow: '2365 kg',
        mtow: '3793 kg',
        mlw: '3793 kg',
        mrw: '3793 kg',
        mzfw: '3793 kg',
        bas: '145 kts',
        fuelGaugesUnit: 2,
        fuelType: 1,
        fbr: '328 Pound JETA1',
        climbFuel: '0 Pound JETA1',
        taxiFuel: '0 Pound JETA1',
        fuelCapacity: '2229 Pound JETA1',
        fuelReserve: 0.7,
        meterType: 0,
        crewRequired: 1,
        v2TrackUnitName: 'MAH',
        departureDelay: null,
        arrivalDelay: null
      },
    ];

    const retrievedAircrafts: Aircraft[] = dataService.getAircraftsByFlightList(flightList);

    expect(retrievedAircrafts).toEqual(expectedAircrafts);
  });

  it('Should be able to get all flights', () => {
    let flightsJSON: Flight[] = require('../../assets/json/flights.json');

    flightsJSON = flightsJSON.splice(0, 40);

    const retrievedFlights: Flight[] = dataService.getAllFlights();

    expect(retrievedFlights).toEqual(flightsJSON);
  });

  it('Should be able to get a flight by its id', () => {

    const expectedFlight = {
      flightId: 'FPG034951',
      mainBookingId: 'PG169472',
      flightDescription: null,
      route: 'MH-D(10:08)-RM-MH',
      airTime: 1.08,
      flightTime: 1.28,
      startDate: '2020-03-09T10:05:00',
      aircraftId: 'AC000045',
      homeBaseId: 'AS000394',
      pilotId: 'CR000066',
      coPilotId: null,
      status: 'CompletedFlight',
      legs: [
        {
          meetingTime: '2020-03-09T09:03',
          meetingTimeFixed: false,
          timeOnGround: 'PT0S',
          timeOnGroundFixed: false,
          nightStop: 0,
          startTaxiTime: 'PT3M',
          destinationTaxiTime: 'PT3M',
          offBlockTimeFixed: false,
          takeoffTimeFixed: true,
          landingTimeFixed: false,
          distance: '64 nm',
          seatsTaken: 2,
          seatsLeft: 7,
          maxSeats: 9,
          startId: 'AS000394',
          destinationId: 'AS000358',
          offBlock: '2020-03-09T10:05',
          takeoff: '2020-03-09T10:08',
          landing: '2020-03-09T10:43',
          onBlock: '2020-03-09T10:46',
          estimate: false,
          airTime: 0.58
        },
        {
          meetingTime: '2020-03-09T10:15',
          meetingTimeFixed: false,
          timeOnGround: 'PT40M',
          timeOnGroundFixed: false,
          nightStop: 0,
          startTaxiTime: 'PT3M',
          destinationTaxiTime: 'PT3M',
          offBlockTimeFixed: false,
          takeoffTimeFixed: false,
          landingTimeFixed: false,
          distance: '64 nm',
          seatsTaken: 5,
          seatsLeft: 4,
          maxSeats: 9,
          startId: 'AS000358',
          destinationId: 'AS000394',
          offBlock: '2020-03-09T11:23',
          takeoff: '2020-03-09T11:26',
          landing: '2020-03-09T11:56',
          onBlock: '2020-03-09T11:59',
          estimate: false,
          airTime: 0.5,
        }
      ]
    };

    const retrievedFlight: Flight = dataService.getFlightById(expectedFlight.flightId);

    expect(retrievedFlight).toEqual(expectedFlight);
  });

  it('Should be able to get all flight names', () => {
    let expectedFlightNames = ['FPG034707', 'FPG034664', 'FPG034951', 'FPG034751', 'FPG034907', 'FPG034882', 'FPG034752', 'FPG034715', 'FPG034879', 'FPG034753', 'FPG034884', 'FPG034897', 'FPG034688', 'FPG034966', 'FPG034891', 'FPG034665', 'FPG034757', 'FPG035008', 'FPG035020', 'FPG034978', 'FPG034689', 'FPG034618', 'FPG034933', 'FPG034695', 'FPG034760', 'FPG035014', 'FPG034941', 'FPG034799', 'FPG034761', 'FPG035021', 'FPG034990', 'FPG034982', 'FPG035015', 'FPG035065', 'FPG034985', 'FPG034999', 'FPG034964', 'FPG034958', 'FPG034957', 'FPG034887', 'FPG034929', 'FPG034873', 'FPG034797', 'FPG034885', 'FPG034911', 'FPG034889', 'FPG034909', 'FPG034878', 'FPG034927', 'FPG034908', 'FPG034663', 'FPG034817', 'FPG034560', 'FPG034919', 'FPG034325', 'FPG034831', 'FPG034888', 'FPG034905', 'FPG034728', 'FPG034702', 'FPG034050', 'FPG034916', 'FPG034866', 'FPG034872', 'FPG034839', 'FPG034915', 'FPG034727', 'FPG034838', 'FPG034739', 'FPG034820', 'FPG034856', 'FPG034842', 'FPG034749', 'FPG034349', 'FPG034830', 'FPG034829', 'FPG034818', 'FPG034717', 'FPG034893', 'FPG034747', 'FPG034372', 'FPG034828', 'FPG034716', 'FPG034501', 'FPG034819', 'FPG034604', 'FPG034690', 'FPG034865', 'FPG034870', 'FPG034748', 'FPG034858', 'FPG034855', 'FPG034834', 'FPG034722', 'FPG034745', 'FPG034833', 'FPG034824', 'FPG034784', 'FPG034851', 'FPG034849', 'FPG034721', 'FPG034812', 'FPG034661', 'FPG034822', 'FPG034802', 'FPG034850', 'FPG034803', 'FPG034746', 'FPG034801', 'FPG034811', 'FPG034479', 'FPG034520', 'FPG034809', 'FPG034554', 'FPG034489', 'FPG034790', 'FPG034808', 'FPG034701', 'FPG034738', 'FPG034700', 'FPG034816', 'FPG034807', 'FPG034729', 'FPG034806', 'FPG034709', 'FPG034345', 'FPG034737', 'FPG034671', 'FPG035025', 'FPG034968', 'FPG034973', 'FPG034987', 'FPG034823', 'FPG035063', 'FPG035023', 'FPG035033', 'FPG035029', 'FPG034974', 'FPG034972', 'FPG035038', 'FPG034913', 'FPG035037', 'FPG033614', 'FPG034955', 'FPG034928', 'FPG035034', 'FPG035053', 'FPG035072', 'FPG034914', 'FPG035004', 'FPG035039', 'FPG035041', 'FPG035054', 'FPG034765', 'FPG035040', 'FPG035077', 'FPG035007', 'FPG035044', 'FPG035006', 'FPG035089', 'FPG034950', 'FPG034918', 'FPG035084', 'FPG034883', 'FPG035009', 'FPG034965', 'FPG035088', 'FPG034768', 'FPG035046', 'FPG035056', 'FPG035050', 'FPG034962', 'FPG034910', 'FPG034674', 'FPG034777', 'FPG034917', 'FPG035012', 'FPG035013', 'FPG034826', 'FPG035092', 'FPG035107', 'FPG034769', 'FPG035016', 'FPG035091', 'FPG035093', 'FPG034976', 'FPG035096', 'FPG034770', 'FPG035026', 'FPG035094', 'FPG035078', 'FPG034758', 'FPG035108', 'FPG035098', 'FPG035024', 'FPG035095', 'FPG035116', 'FPG034759', 'FPG034773', 'FPG035106', 'FPG035081', 'FPG034848', 'FPG034774', 'FPG034947', 'FPG035103', 'FPG034775', 'FPG035129', 'FPG035130', 'FPG035002', 'FPG035113', 'FPG035125', 'FPG034948', 'FPG035111', 'FPG035138', 'FPG035099', 'FPG035139', 'FPG035083', 'FPG034875', 'FPG035136', 'FPG035156', 'FPG035043', 'FPG035109', 'FPG034452', 'FPG034735', 'FPG035105', 'FPG035076', 'FPG035144', 'FPG035115', 'FPG035074', 'FPG035141', 'FPG035147', 'FPG035157', 'FPG034854', 'FPG035132', 'FPG035117', 'FPG035159', 'FPG035148', 'FPG035191', 'FPG035190', 'FPG035158', 'FPG035162', 'FPG034608', 'FPG035164', 'FPG035163', 'FPG035165', 'FPG034655', 'FPG034654', 'FPG035153', 'FPG034459', 'FPG035133', 'FPG035166',]

    expectedFlightNames = expectedFlightNames.splice(0, 40);

    const retrievedFlightNames: string[] = dataService.getAllFlightNames();
    console.log(retrievedFlightNames);
    

    expect(expectedFlightNames).toEqual(retrievedFlightNames);
  });

  it('Should be able to group flights by aircraft', () => {

    const flightList: Flight[] = [
      {
        flightId: 'FPG034707',
        aircraftId: 'AC000033',
      },
      {
        flightId: 'FPG034664',
        aircraftId: 'AC000027',
      },
      {
        flightId: 'FPG014814',
        aircraftId: 'AC000027',
      }
    ];

    const expectedGroup = {
      AC000033: [{
        flightId: 'FPG034707',
        aircraftId: 'AC000033',
      }],
      AC000027: [
        {
          flightId: 'FPG034664',
          aircraftId: 'AC000027',
        },
        {
          flightId: 'FPG014814',
          aircraftId: 'AC000027',
        }
      ]
    }

    const groupedFlights = dataService.groupFlightsByAircraftId(flightList);

    expect(groupedFlights).toEqual(expectedGroup);
  });
});
