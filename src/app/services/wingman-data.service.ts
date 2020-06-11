import { Airstrip } from './../shared/models/airstrip.model';
import { Flight } from './../shared/models/flight.model';

import { environment } from 'src/environments/environment';

const airplanes = require('../../assets/json/airplanes.json');
const airstrips = require('../../assets/json/airstrips.json');
const flights = require('../../assets/json/flights.json');

export class WingmanDataService {

    // Get all the flights from the assets/json folder.
    getAllFlights() {
        return flights;
    }

    // Get only the first flight from the assets/json folder
    getFirstFlight() {
        return flights[0];
    }

    // Get the flight number by passed id
    getFlightbyId(id: string) {
        return flights.filter(flight => {
            return flight.flightId === id;
        })[0];
    }

    getAllFlightNames() {
        return flights.map(x => x.flightId);
    }

    // Get all the airstrips from the assets/json folder.
    getAllAirstrips() {
        return airstrips;
    }

    // Get all the airstrips within the idList from the assets/json folder.
    getAirstripsByIdList(idList: string[]) {
        return airstrips.filter(airstrip => {
            return idList.indexOf(airstrip.airstripId) > -1;
        });
    }

    getAirstripById(id: string): Airstrip {
        return airstrips.filter(airstrip => airstrip.airstripId === id)[0];
    }

    // Get all the airplanes from the assets/json folder.
    getAllAirplanes() {
        return airplanes;
    }

    getLegAirstripPairByFlight(flight: Flight): [[Airstrip, Airstrip]]{
        const flightPairs = flight.legs.map(leg =>
            [
                this.getAirstripById(leg.startId),
                this.getAirstripById(leg.destinationId)
            ]
        );
        return flightPairs as [[Airstrip, Airstrip]];
    }

    getAirstripsByFlight(flight: Flight, filter?: boolean): Airstrip[] {
        let airstripIds = [];

        // Gets the airstrips IDs from the legs
        flight.legs.forEach(leg => {
            airstripIds.push(leg.startId);
            airstripIds.push(leg.destinationId);
        });

        if(filter){
            // Filter duplicate ID's
            airstripIds = airstripIds.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        }

        // Get and return only the relevant airstrip info
        return this.getAirstripsByIdList(airstripIds);
    }
}
