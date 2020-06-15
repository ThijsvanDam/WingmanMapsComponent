// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { of } from 'rxjs';

// import { MapComponent } from './map.component';

// import { Flight } from '../../shared/models/flight.model';

// import { WingmanDataService } from '../../services/wingman-data.service';
// import { WingmanMapService } from '../../services/wingman-map.service';


// describe('MapComponent: ', () => {
//     let component: MapComponent;
//     let fixture: ComponentFixture<MapComponent>;

//     let mapService: WingmanMapService;
//     let dataService: WingmanDataService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [MapComponent],
//             providers: [ WingmanMapService,
//                 { provide: WingmanDataService }
//             ],
//             schemas: [NO_ERRORS_SCHEMA]
//         });

//         mapService = TestBed.inject(WingmanMapService);
//         dataService = TestBed.inject(WingmanDataService);

//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(MapComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('Should be able to call the showAllAirstrips of the map service', () => {
//         const showAllAirstripsSpy = spyOn(mapService, 'showAllAirstrips');

//         expect(showAllAirstripsSpy).not.toHaveBeenCalled();

//         component.handleAllAirstrips();

//         expect(showAllAirstripsSpy).toHaveBeenCalled();
//     });

//     it('Should be able to call the showRelevantAistrips of the map service', () => {
//         const showRelevantAirstripsSpy = spyOn(mapService, 'showRelevantAirstrips');

//         expect(showRelevantAirstripsSpy).not.toHaveBeenCalled();

//         component.handleRelevantAirstrips();

//         expect(showRelevantAirstripsSpy).toHaveBeenCalled();
//     });

//     it('Should all necessary methods on AfterViewInit', () => {
//         const showAllAirstripsSpy = spyOn(mapService, 'showAllAirstrips');
//         const initializeMapSpy = spyOn(mapService, 'initializeMap');
//         const getFirstFlightSpy = spyOn(dataService, 'getFirstFlight');

//         expect(showAllAirstripsSpy).not.toHaveBeenCalled();
//         expect(initializeMapSpy).not.toHaveBeenCalled();
//         expect(getFirstFlightSpy).not.toHaveBeenCalled();

//         component.ngAfterViewInit();

//         expect(showAllAirstripsSpy).toHaveBeenCalled();
//         expect(initializeMapSpy).toHaveBeenCalled();
//         expect(getFirstFlightSpy).toHaveBeenCalled();
//     });

// });
