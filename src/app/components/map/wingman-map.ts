import { Injectable } from '@angular/core';

import { Map, Icon, MapOptions, Control, LayerGroup, Marker, control } from 'leaflet';

import { CookieService } from './../../services/cookie.service';

import { environment } from 'src/environments/environment';

export class WingmanMap extends Map {
  // Everything considering layers of the map
  private attributions = {};
  private overlayMaps = {};
  private baseMaps = {};

  private mapControl;

  constructor(private cookieService: CookieService, mapId: string, options?: MapOptions) {
    super(mapId, options);

  }

  public saveMapSettingsOnChange(){
    this.on('baselayerchange', this.saveMapControlOptions);
    this.on('overlayadd', this.saveMapControlOptions);
    this.on('overlayremove', this.saveMapControlOptions);
  }


  public addBaseMap(baseMapName, leafletBaseLayer, options?: AddMapOptions) {
    // Remember the base map locally
    this.baseMaps[baseMapName] = leafletBaseLayer;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined) {
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[baseMapName] = leafletBaseLayer;
      this.mapControl = new Control.Layers(layerObject, undefined).addTo(this);
    } else {
      this.mapControl.addBaseLayer(leafletBaseLayer, baseMapName);
    }
    const cookie = JSON.parse(this.cookieService.getCookie('control'));
    if(cookie){
      if(cookie[baseMapName]){
        leafletBaseLayer.addTo(this);
      }
    }else if(options !== undefined) {
      if (options.enable) {
        leafletBaseLayer.addTo(this);
      }
    }
  }

  public addOverlayMap(layerName, leafletOverlayMap, options?: AddMapOptions) {
    // Remember the overlay locally
    this.overlayMaps[layerName] = leafletOverlayMap;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined) {
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[layerName] = leafletOverlayMap;
      if (options.enable) {
        leafletOverlayMap.addTo(this);
      }
      this.mapControl = new Control.Layers(undefined, layerObject).addTo(this);
    } else {
      this.mapControl.addOverlay(leafletOverlayMap, layerName);
    }

    const cookie = JSON.parse(this.cookieService.getCookie('control'));
    if(cookie){
      if(cookie[layerName]){
        leafletOverlayMap.addTo(this);
      }
    }else if(options !== undefined) {
      if (options.enable) {
        leafletOverlayMap.addTo(this);
      }
    }
  }

  public saveMapControlOptions(){
    const controlOptions = {};

    this.mapControl._layerControlInputs.forEach((layer, index) => {
      controlOptions[this.mapControl._layers[index].name] = layer.checked;
    });
    console.log(JSON.stringify(controlOptions));
    this.cookieService.setCookie('control', JSON.stringify(controlOptions), 2);
  }
}

interface AddMapOptions {
  enable: boolean;
}
