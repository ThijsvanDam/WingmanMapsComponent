import { Component } from '@angular/core';

import { WingmanDataService } from './../../services/wingman-data.service';
import { WingmanMapService } from '../../services/wingman-map.service';

import { Aircraft } from '../../shared/models/aircraft.model';
import { Flight } from 'src/app/shared/models/flight.model';

import { FlightEnabled } from './../flight-list/flight-list.component';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent {
  allFlights: string[];
  aircrafts: Aircraft[];

  constructor(private mapService: WingmanMapService, private dataService: WingmanDataService) {
    this.allFlights = this.dataService.getAllFlightNames();
  }

  /**
   * Call the dataservice observable with new flight list, with a removed or added flight.
   * @param flightEnabled containing which flight has been enabled whether or not.
   */
  public flightsSelectedChanged(flightEnabled: FlightEnabled) {
    let nextFlights;

    if (flightEnabled.enabled) {
      nextFlights = this.dataService.currentlySelectedFlights.getValue();
      nextFlights.push(this.dataService.getFlightById(flightEnabled.flightId));
    } else {
      nextFlights = this.dataService.currentlySelectedFlights.getValue().filter(flight => flight.flightId !== flightEnabled.flightId);
    }
    this.dataService.currentlySelectedFlights.next(nextFlights);
  }

  // Getting information for the view

  /**
   * Get aircrafts according to the currently selected flights from the data service.
   */
  public getAircrafts(): Aircraft[] {
    const selectedFlights: Flight[] = this.dataService.getAllFlights().filter(x => x.aircraftId !== null);
    return this.dataService.getAircraftsByFlightList(selectedFlights);
  }

  /**
   * Get the flights from the data service without an aircraft linked to it
   */
  public getFlightsWithoutAircraft(): Flight[] {
    return this.dataService.getAllFlights().filter(x => x.aircraftId === null);
  }

  /**
   * Get an object with the flights grouped by their aircraft.
   */
  public getFlightsByAircraft() {
    const flights: Flight[] = this.dataService.getAllFlights().filter(x => x.aircraftId !== null);
    return this.dataService.groupFlightsByAircraftId(flights);
  }

  // Input and button handlers for the view
  public handleAllAirstripsButton() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstripsButton() {
    this.mapService.showRelevantAirstripMarkers();
  }

  public handleShowAllFlightsButton() {
    this.dataService.currentlySelectedFlights.next(this.dataService.getAllFlights());
  }

  public handleSelectFlightDropdown(selectedFlight: string) {
    this.dataService.currentlySelectedFlights.next([this.dataService.getFlightById(selectedFlight)]);
  }
}
