import { BehaviorSubject } from 'rxjs';

import { Aircraft } from './../shared/models/airplane.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Flight } from './../shared/models/flight.model';

const aircraftJSON: Aircraft[] = require('../../assets/json/airplanes.json');
const airstripsJSON: Airstrip[] = require('../../assets/json/airstrips.json');
const flightsJSON: Flight[] = require('../../assets/json/flights.json');

export class WingmanDataService {
    currentlySelectedFlights: BehaviorSubject<Flight[]>;

    private aircrafts: Aircraft[];
    private airstrips: Airstrip[];
    private flights: Flight[];

    constructor() {
        // The data can be passed through the parameters of the constructor.
        this.aircrafts = aircraftJSON;
        this.airstrips = airstripsJSON;
        // The splice has to be removed in production.
        this.flights = flightsJSON.splice(0, 40);

        // Create the obserable and straight up subscribe to set the local flight list in this service.
        this.currentlySelectedFlights = new BehaviorSubject<Aircraft[]>(this.flights);
        this.currentlySelectedFlights.subscribe(flights => this.selectFlights(flights));
    }

    /**
     * Get all flights.
     */
    getAllFlights(): Flight[]{
        return this.flights;
    }

    /**
     * Get the first flight.
     */
    getFirstFlight(): Flight{
        return this.flights[0];
    }

    /**
     * Get the flight number by passed id.
     */
    getFlightbyId(flightId: string): Flight{
        return this.flights.filter(flight => {
            return flight.flightId === flightId;
        })[0];
    }

    /**
     * Get the flight names.
     */
    getAllFlightNames(): string[]{
        return this.flights.map(x => x.flightId);
    }

    /**
     * Get all the airstrips.
     */
    getAllAirstrips(): Airstrip[]{
        return this.airstrips;
    }

    /**
     * Get only the airstrips which id's are given inside the idList.
     */
    getAirstripsByIdList(airstripIdList: string[]): Airstrip[]{
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
    getAirstripPairsByFlight(flight: Flight): [[Airstrip, Airstrip]]{
        const flightPairs = flight.legs.map(leg =>
            [
                this.getAirstripById(leg.startId),
                this.getAirstripById(leg.destinationId)
            ]
        );
        return flightPairs as [[Airstrip, Airstrip]];
    }

    /**
     * Get a list of airstrips according to the airtripIds inside the given flight legs.
     */
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

    /**
     * Method the observable will call on 'next', to set the local flights.
     */
    private selectFlights(selectedFlights: Flight[]){
        this.flights.map(flight => {
            flight.selected = selectedFlights.indexOf(flight) > -1;
        });
    }

    /**
     * Get all aircrafts.
     */
    getAllAircrafts(): Aircraft[]{
        return this.aircrafts;
    }

    /**
     * Get all aircrafts by the given id.
     */
    getAircraftById(aircraftId: string){
        return this.aircrafts.filter(aircraft => {
            return aircraft.aircraftId === aircraftId;
        })[0];
    }

    /**
     * Get all aircrafts according to the given flights.
     */
    getAircraftsByFlightList(flights: Flight[]){
        return flights.map(flight => {
            return this.getAircraftById(flight.aircraftId);
        });
    }

    /**
     * Group flights by aircraftId property.
     */
    groupFlightsByAircraftId(flights: Flight[]){
        return this.groupBy(flights, 'aircraftId');
    }

    /**
     * Group items of a list by a given property.
     * This will return an object with a property for each group.
     */
    private groupBy(list, property){
        const newList = {};
        list.map(listItem => {
            if (newList[listItem[property]] === undefined){
                newList[listItem[property]] = [];
            }
            newList[listItem[property]].push(listItem);
        });
        return newList;
    }
}
