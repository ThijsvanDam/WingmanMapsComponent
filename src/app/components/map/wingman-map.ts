import { Injectable } from '@angular/core';

import { Map, Icon, MapOptions, Control, LayerGroup, Marker } from 'leaflet';

// Downloaded from https://github.com/MazeMap/Leaflet.TileLayer.PouchDBCached
import 'src/assets/javascript/L.TileLayer.PouchDBCached.js';

import { WingmanDataService } from '../../services/wingman-data.service';

import { environment } from 'src/environments/environment';

export class WingmanMap extends Map {
  // Everything considering layers of the map
  private attributions = {};
  private overlayMaps = {};
  private baseMaps = {};

  private mapControl;

  constructor(private dataService: WingmanDataService, mapId: string, options?: MapOptions) {
    super(mapId, options);
  }

  public addBaseMap(mapName, leafletBaseLayer){
    // Remember the base map locally
    this.baseMaps[mapName] = leafletBaseLayer;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined){
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[mapName] = leafletBaseLayer;
      this.mapControl = new Control.Layers(layerObject, undefined).addTo(this);
    }else{
      this.mapControl.addBaseLayer(leafletBaseLayer, mapName);
    }
  }


  public addOverlayMap(mapName, leafletOverlayMap){
    // Remember the overlay locally
    this.overlayMaps[mapName] = leafletOverlayMap;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined){
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[mapName] = leafletOverlayMap;
      this.mapControl = new Control.Layers(undefined, layerObject).addTo(this);
    }else{
      this.mapControl.addOverlay(leafletOverlayMap, mapName);
    }
  }
}
