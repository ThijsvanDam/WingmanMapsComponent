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

  public saveMapSettingsOnChange() {
    this.on('baselayerchange', this.saveMapControlOptions);
    this.on('overlayadd', this.saveMapControlOptions);
    this.on('overlayremove', this.saveMapControlOptions);
  }


  public addBaseMap(baseMapName, leafletBaseMap: L.Layer, options?: AddMapOptions) {
    // Remember the base map locally
    this.baseMaps[baseMapName] = leafletBaseMap;

    // The layer has to be added to a mapControl,
    // if this doesnt exists yet, create it!
    if (this.mapControl === undefined) {
      // The control layer requires this to be an object with name:object
      const layerObject = {};
      layerObject[baseMapName] = leafletBaseMap;
      this.mapControl = new Control.Layers(layerObject, undefined).addTo(this);
    } else {
      this.mapControl.addBaseLayer(leafletBaseMap, baseMapName);
    }

    const cookieExisted = this.addLayerWhenCookie(baseMapName, leafletBaseMap);
    if (options) {
      if (!cookieExisted && options.enable) {
        leafletBaseMap.addTo(this);
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
      this.mapControl = new Control.Layers(undefined, layerObject).addTo(this);
    } else {
      this.mapControl.addOverlay(leafletOverlayMap, layerName);
    }

    const cookieExisted = this.addLayerWhenCookie(layerName, leafletOverlayMap);
    if (options) {
      if (!cookieExisted && options.enable) {
        leafletOverlayMap.addTo(this);
      }
    }
  }

  public addLayerWhenCookie(layerName: string, layer: L.Layer) {
    let cookie = this.cookieService.getCookie('layer');
    if (cookie) {
      cookie = JSON.parse(cookie);
      if (cookie[layerName]) {
        layer.addTo(this);
      }
      return true;
    }
    return false;
  }

  public saveMapControlOptions() {
    const controlOptions = {};

    this.mapControl._layerControlInputs.forEach((layer, index) => {
      controlOptions[this.mapControl._layers[index].name] = layer.checked;
    });
    this.cookieService.setCookie('layer', JSON.stringify(controlOptions), 0.5);
  }
}

interface AddMapOptions {
  enable: boolean;
}
