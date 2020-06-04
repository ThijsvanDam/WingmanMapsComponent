import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { Airplane } from './../shared/models/airplane.model';
import { Airstrip } from './../shared/models/airstrip.model';
import { Flight } from './../shared/models/flight.model';

declare var require: any;
const airstrips = require('../../assets/json/airstrips.json');
const flights = require('../../assets/json/flights.json');
const airplanes = require('../../assets/json/airplanes.json');

/**
 * This class serves all Wingman data from the given API's.
 * Note:
 * There is no spec for this service, because its functionality is straight forward.
 */
@Injectable()
export class WingmanDataService {

    // Get all the flights from the assets/json folder.
    getAllFlights(): Flight[] {
        return flights;
    }

    // Get only the first flight from the assets/json folder
    getFirstFlight(): Flight {
        return flights[0];
    }

    // Get all the airstrips from the assets/json folder.
    getAllAirstrips(): Airstrip[]{
        return airstrips;
    }

    // Get all the airstrips within the idList from the assets/json folder.
    getAirstripsByIdList(idList: string[]): Airstrip[]{
        return airstrips.filter(airstrip => {
            return idList.indexOf(airstrip.airstripId) > -1;
        });
    }

    // Get all the airplanes from the assets/json folder.
    getAllAirplanes(): Airplane[]{
        return airplanes;
    }
}
