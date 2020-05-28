import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMapComponent } from './dynamic-map.component';
import { WingmanMap } from './leaflet-map';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';

class LeafletMapMock {
  public addLayer() { }
  public removeLayer() { }

  public showAllAirstrips() { }
  public showRelevantAirstrips() { }

}

describe('DynamicMapComponent', () => {
  let component: DynamicMapComponent;
  let fixture: ComponentFixture<DynamicMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should set the WingmanMap', () => {

    const wingmanMap = new LeafletMapMock();

    component.map = wingmanMap;

    expect(component.map).toBeInstanceOf(WingmanMap);
  });

  it('should call showAllAirstrips of the leaflet map', () => {


    const wingmanMap = new LeafletMapMock();

    component.map = wingmanMap;
    const spiedShowAllAirstrops = spyOn<any>(component.map, 'showAllAirstrips');

    component.handleAllAirstrips();

    expect(spiedShowAllAirstrops).toHaveBeenCalled();
  });

  it('should call handleRelevantFlight with the current flight of the leaflet map', () => {
    const flights = [
      {
          flightId: 'FPG035200',
          mainBookingId: 'PG170393',
          flightDescription: null,
          route: 'MH-BM-GA-MH',
          airTime: 2.85,
          flightTime: 3.15,
          startDate: '2020-04-27T06:15:00',
          aircraftId: 'AC000034',
          homeBaseId: null,
          pilotId: null,
          coPilotId: null,
          status: 'PlannedFlight',
          legs: [
              {
                  meetingTime: '2020-04-27T05:18',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT0S',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '156 nm',
                  seatsTaken: 5,
                  seatsLeft: 4,
                  maxSeats: 9,
                  startId: 'AS000394',
                  destinationId: 'AS000052'
              },
              {
                  meetingTime: '2020-04-27T07:08',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT40M',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '188 nm',
                  seatsTaken: 0,
                  seatsLeft: 9,
                  maxSeats: 9,
                  startId: 'AS000052',
                  destinationId: 'AS000180'
              },
              {
                  meetingTime: '2020-04-27T09:12',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT40M',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '67 nm',
                  seatsTaken: 0,
                  seatsLeft: 9,
                  maxSeats: 9,
                  startId: 'AS000180',
                  destinationId: 'AS000394'
              }
          ]
      },
      {
          flightId: 'FPG035201',
          mainBookingId: 'PG170395',
          flightDescription: null,
          route: 'GA-DA-DU-MH',
          airTime: 4.29,
          flightTime: 4.59,
          startDate: '2020-04-27T08:30:00',
          aircraftId: 'AC000029',
          homeBaseId: null,
          pilotId: null,
          coPilotId: null,
          status: 'PlannedFlight',
          legs: [
              {
                  meetingTime: '2020-04-27T07:33',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT0S',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '204 nm',
                  seatsTaken: 1,
                  seatsLeft: 8,
                  maxSeats: 9,
                  startId: 'AS000180',
                  destinationId: 'AS000117'
              },
              {
                  meetingTime: '2020-04-27T09:43',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT40M',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '213 nm',
                  seatsTaken: 0,
                  seatsLeft: 9,
                  maxSeats: 9,
                  startId: 'AS000117',
                  destinationId: 'AS000118'
              },
              {
                  meetingTime: '2020-04-27T11:57',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT40M',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '206 nm',
                  seatsTaken: 0,
                  seatsLeft: 9,
                  maxSeats: 9,
                  startId: 'AS000118',
                  destinationId: 'AS000394'
              }
          ]
      },
      {
          flightId: 'FPG035202',
          mainBookingId: 'PG170396',
          flightDescription: null,
          route: 'TE-GA-TE',
          airTime: 3.2,
          flightTime: 3.4,
          startDate: '2020-04-30T08:30:00',
          aircraftId: 'AC000034',
          homeBaseId: null,
          pilotId: null,
          coPilotId: null,
          status: 'PlannedFlight',
          legs: [
              {
                  meetingTime: '2020-04-30T07:33',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT0S',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '231 nm',
                  seatsTaken: 1,
                  seatsLeft: 8,
                  maxSeats: 9,
                  startId: 'AS000557',
                  destinationId: 'AS000180'
              },
              {
                  meetingTime: '2020-04-30T09:55',
                  meetingTimeFixed: false,
                  timeOnGround: 'PT40M',
                  timeOnGroundFixed: false,
                  nightStop: 0,
                  startTaxiTime: 'PT3M',
                  destinationTaxiTime: 'PT3M',
                  offBlockTimeFixed: false,
                  takeoffTimeFixed: false,
                  landingTimeFixed: false,
                  distance: '231 nm',
                  seatsTaken: 0,
                  seatsLeft: 9,
                  maxSeats: 9,
                  startId: 'AS000180',
                  destinationId: 'AS000557'
              }
          ]
      }
  ];

    const wingmanMap = new LeafletMapMock();
    const flightsJson = flights[0];

    component.map = wingmanMap;
    component.selectedFlight = flightsJson;

    const spiedShowAllAirstrops = spyOn<any>(component.map, 'showRelevantAirstrips');

    component.handleRelevantAirstrips();

    expect(spiedShowAllAirstrops).toHaveBeenCalledWith(flightsJson);
  });
});
