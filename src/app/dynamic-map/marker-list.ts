import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { ElementRef } from '@angular/core';

export class MarkerList {

  private markers;
  private icons;

  constructor() {


    this.icons = {
      airstrip: L.icon({
        iconUrl: environment.marker.airstrip_image,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      }),
      waypoint: L.icon({
        iconUrl: environment.marker.waypoint_image,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      })
    };


  }


  public createAirstripMarkerList(airstrips) {
    // Map all relevant data of the airstrip to the airstripArray
    const airstripsArray = airstrips.map(airstrip => {
      const marker = L.marker(
        // Set the position of the marker to the position of the airstrip
        [airstrip.position.latDeg, airstrip.position.longDeg],
        // The icon is an airstrip or a waypoint according to the value of waypointOnly
        { icon: Boolean(airstrip.waypointOnly) ? this.icons.waypoint : this.icons.airstrip }
        // Bind a popup with the airstrip name to the marker
      ).bindPopup(this.generateMarkerPopup(airstrip));
      marker.on('mouseover', function(e) {
        this.openPopup();
      });
      // marker.on('popupopen', function(e){
      //   // document.getElementById("textArea").value = this.textAreaValue;
      // })
      // marker.on('popupclose', function(e){
      //   // TODO: Add preservation of notes.
      //   // let popupContent : ElementRef = e.popup.getElement();
      //   // this.textAreaValue = document.getElementById("textArea").value;
      // });
      return marker;
    });
    return airstripsArray;
  }

  private generateMarkerPopup(airstrip) {
    const type = airstrip.waypointOnly ? 'waypoint' : 'airstrip';

    const markerContent = `
    <h3>${airstrip.name} (${airstrip.displayName})</h3>
    <p>
      This is ` + (airstrip.mafBase ? `` : `<b>not</b>`) + ` a maf base.<br>
      Avgas is <b>` + (airstrip.avgasAvailable ? 'available' : 'unavailable') + `<br>
      </b> and jetA1 is <b>` + (airstrip.jetA1Available ? 'available' : 'unavailable') + `</b>.<br>
      Notes: <br>
      <textarea id='textArea' (input)='markerFeedback()'></textarea>
    </p>`;

    return markerContent;
  }
}
