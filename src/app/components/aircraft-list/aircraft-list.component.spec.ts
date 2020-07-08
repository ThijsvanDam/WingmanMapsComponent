import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftListComponent } from './aircraft-list.component';

describe('Aircraft list component', () => {
    let component: AircraftListComponent;
    let fixture: ComponentFixture<AircraftListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AircraftListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AircraftListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.aircrafts = [
            {
                aircraftId: 'A1',
            },
            {
                aircraftId: 'A2',
            },
        ];

        component.flightsByAircraftId = {
            A1: [
                { flightId: 'id1' },
                { flightId: 'id2' }
            ],
            A2: [
                { flightId: 'id3' },
                { flightId: 'id4' }
            ],
        };
    });

    it('Should get aircrafts by their id', () => {
        const expectedAircraft = component.aircrafts[0];

        const retrievedAircraft = component.getAircraftByAircraftId('A1');

        expect(expectedAircraft).toEqual(retrievedAircraft);
    });

    it('Should get the correct aircraft ids', () => {
        const expectedAircraftIds = ['A1', 'A2'];

        const retrievedAircraftIds = component.getAircraftIds();

        expect(retrievedAircraftIds).toEqual(expectedAircraftIds);
    });

    it('Should get a flight list by an aircraft id', () => {
        const aircraftId = 'A2';

        const expectedFlightList = {
            A2: [
                { flightId: 'id3' },
                { flightId: 'id4' }
            ]
        };

        const retrievedFlights = component.getFlights(aircraftId);

        expect(retrievedFlights).toEqual(expectedFlightList.A2);
    });
});
