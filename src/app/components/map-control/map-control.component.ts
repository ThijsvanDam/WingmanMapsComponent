import { WingmanDataService } from './../../services/wingman-data.service';
import { Component, OnInit } from '@angular/core';
import { WingmanMapService } from '../../services/wingman-map.service';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss']
})
export class MapControlComponent {

  constructor(private mapService: WingmanMapService, private dataService: WingmanDataService) { }


  public handleAllAirstrips() {
    this.mapService.showAllAirstrips();
  }

  public handleRelevantAirstrips() {
    this.mapService.showRelevantAirstrips();
  }

  public getFlights(){
    return this.dataService.getAllFlights();
  }
}
