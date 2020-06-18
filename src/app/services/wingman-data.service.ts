import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Airplane } from './../shared/models/airplane.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Flight } from './../shared/models/flight.model';

import { environment } from 'src/environments/environment';

const airplanesJSON: Airplane[] = require('../../assets/json/airplanes.json');
const airstripsJSON: Airstrip[] = require('../../assets/json/airstrips.json');
const flightsJSON: Flight[] = require('../../assets/json/flights.json');

export class WingmanDataService {
    currentlySelectedFlights: BehaviorSubject<Flight[]>;

    private airplanes: Airplane[];
    private airstrips: Airstrip[];
    private flights: Flight[];

    constructor() {
        this.airplanes = airplanesJSON;
        this.airstrips = airstripsJSON;
        this.flights = flightsJSON.splice(0, 40);
        this.currentlySelectedFlights = new BehaviorSubject<Airplane[]>(this.flights);
        this.currentlySelectedFlights.subscribe(flights => this.selectFlights(flights));
    }

    // Get all the flights from the assets/json folder.
    getAllFlights(): Flight[]{
        return this.flights;
    }

    // Get only the first flight from the assets/json folder
    getFirstFlight(): Flight{
        return this.flights[0];
    }

    // Get the flight number by passed id
    getFlightbyId(id: string): Flight{
        return this.flights.filter(flight => {
            return flight.flightId === id;
        })[0];
    }

    getAllFlightNames(): string[]{
        return this.flights.map(x => x.flightId);
    }

    // Get all the airstrips from the assets/json folder.
    getAllAirstrips(): Airstrip[]{
        return this.airstrips;
    }

    // Get all the airstrips within the idList from the assets/json folder.
    getAirstripsByIdList(idList: string[]): Airstrip[]{
        return this.airstrips.filter(airstrip => {
            return idList.indexOf(airstrip.airstripId) > -1;
        });
    }

    getAirstripById(id: string): Airstrip {
        return this.airstrips.filter(airstrip => airstrip.airstripId === id)[0];
    }

    // Get all the airplanes from the assets/json folder.
    getAllAirplanes(): Airplane[]{
        return this.airplanes;
    }

    getAirstripPairsByFlight(flight: Flight): [[Airstrip, Airstrip]]{
        const flightPairs = flight.legs.map(leg =>
            [
                this.getAirstripById(leg.startId),
                this.getAirstripById(leg.destinationId)
            ]
        );
        return flightPairs as [[Airstrip, Airstrip]];
    }

    getAirstripsByFlight(flight: Flight, filterDuplicates?: boolean): Airstrip[] {
        let airstripIds = [];

        // Gets the airstrips IDs from the legs
        flight.legs.forEach(leg => {
            airstripIds.push(leg.startId);
            airstripIds.push(leg.destinationId);
        });

        if (filterDuplicates){
            // Filter duplicate ID's
            airstripIds = airstripIds.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        }

        // Get and return only the relevant airstrip info
        return this.getAirstripsByIdList(airstripIds);
    }

    selectFlights(selectedFlights: Flight[]){
        this.flights.map(flight => {
            flight.selected = selectedFlights.indexOf(flight) > -1;
        });
    }
}
