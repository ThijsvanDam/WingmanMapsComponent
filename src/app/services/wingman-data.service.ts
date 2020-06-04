import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

declare var require: any;
const airstrips = require('../../assets/json/airstrips.json');
const flights = require('../../assets/json/flights.json');
const airplanes = require('../../assets/json/airplanes.json');

@Injectable()
export class WingmanDataService {

    // Get all the flights from the assets/json folder.
    getAllFlights() {
        return flights;
    }

    // Get only the first flight from the assets/json folder
    getFirstFlight() {
        return flights[0];
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

    // Get all the airplanes from the assets/json folder.
    getAllAirplanes() {
        return airplanes;
    }
}