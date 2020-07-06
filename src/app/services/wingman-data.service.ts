import { BehaviorSubject } from 'rxjs';

import { Aircraft } from './../shared/models/aircraft.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Flight } from './../shared/models/flight.model';

const aircraftJSON: Aircraft[] = require('../../assets/json/aircrafts.json');
const airstripsJSON: Airstrip[] = require('../../assets/json/airstrips.json');
const flightsJSON: Flight[] = require('../../assets/json/flights.json');

/**
 * The injectable angular service providing wingman data to each unit of the WingmanMapsComponent.
 * @note Current data sources are local .json files.
 */
export class WingmanDataService {
    public currentlySelectedFlights: BehaviorSubject<Flight[]>;

    private aircrafts: Aircraft[];
    private airstrips: Airstrip[];
    private flights: Flight[];

    constructor() {
        // The data can be passed through the parameters of the constructor.
        this.aircrafts = aircraftJSON;
        this.airstrips = airstripsJSON;
        // The splice has to be removed in production.
        this.flights = flightsJSON;
        // this.flights = flightsJSON.splice(0, 40);

        // Create the obserable and straight up subscribe to set the local flight list in this service.
        this.currentlySelectedFlights = new BehaviorSubject<Aircraft[]>(this.flights);
        this.currentlySelectedFlights.subscribe(flights => this.selectFlights(flights));
    }

    /**
     * Get all currently selected flights.
     */
    getAllFlights(): Flight[] {
        return this.flights;
    }

    /**
     * Get the flight number by passed id.
     */
    getFlightById(flightId: string): Flight {
        return this.flights.filter(flight => {
            return flight.flightId === flightId;
        })[0];
    }

    /**
     * Get the flight names.
     */
    getAllFlightNames(): string[] {
        let a = this.flights.map(x => x.flightId);
        console.log('askimibi');
        console.log(a);
        
        return this.flights.map(x => x.flightId);
    }

    /**
     * Get all the airstrips.
     */
    getAllAirstrips(): Airstrip[] {
        return this.airstrips;
    }

    /**
     * Get only the airstrips which id's are given inside the idList.
     */
    getAirstripsByIdList(airstripIdList: string[]): Airstrip[] {
        return this.airstrips.filter(airstrip => {
            return airstripIdList.indexOf(airstrip.airstripId) > -1;
        });
    }

    /**
     * Get the airstrip by the given id.
     */
    getAirstripById(airstripId: string): Airstrip {
        return this.airstrips.filter(airstrip => airstrip.airstripId === airstripId)[0];
    }

    /**
     * Get a list of airstrip pairs for each leg of the given flight.
     */
    getAirstripPairsByFlight(flight: Flight): [[Airstrip, Airstrip]] {
        const flightPairs = flight.legs.map(leg =>
            [
                this.getAirstripById(leg.startId),
                this.getAirstripById(leg.destinationId)
            ]
        );
        return flightPairs as [[Airstrip, Airstrip]];
    }

    /**
     * Get all aircrafts by the given id.
     */
    getAircraftById(aircraftId: string) {
        return this.aircrafts.filter(aircraft => {
            return aircraft.aircraftId === aircraftId;
        })[0];
    }

    /**
     * Get all aircrafts according to the given flights.
     */
    getAircraftsByFlightList(flights: Flight[]) {
        return flights.map(flight => {
            return this.getAircraftById(flight.aircraftId);
        });
    }

    /**
     * Group flights by aircraftId property.
     */
    groupFlightsByAircraftId(flights: Flight[]) {
        return this.groupBy(flights, 'aircraftId');
    }

    /**
     * Method the observable will call on 'next', to set the local flights.
     */
    private selectFlights(selectedFlights: Flight[]) {
        this.flights.map(flight => {
            flight.selected = selectedFlights.indexOf(flight) > -1;
        });
    }

    /**
     * Group items of a list by a given property.
     * This will return an object with a property for each group.
     */
    private groupBy(list, property) {
        const newList = {};
        list.map(listItem => {
            if (newList[listItem[property]] === undefined) {
                newList[listItem[property]] = [];
            }
            newList[listItem[property]].push(listItem);
        });
        return newList;
    }
}
