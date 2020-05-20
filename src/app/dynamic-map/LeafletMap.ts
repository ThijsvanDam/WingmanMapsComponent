import * as L from 'leaflet';

export class LeafletMap {
  private map;

  constructor(center: [number, number], zoom: number) {
    this.map = L.map('map', {
      center: center,
      zoom: zoom
    });

   }

   public addTileLayer(url, attr){
     
    const tiles = L.tileLayer(url, {
      maxZoom: 19,
      attribution: attr
    });

    tiles.addTo(this.map);
   }
}
