
import { Map, MapOptions, Control, Layer } from 'leaflet';

import { CookieService } from './../../services/cookie.service';

export class WingmanMap extends Map {
  // Everything considering layers of the map
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

  /**
   * Add a base map to the map control.
   * When the map (with the baseMapName) is inside the cookies, the cookie value will be used.
   * @param baseMapName The name shown in the leaflet map control
   * @param leafletBaseMap The leaflet base map type of Layer
   * @param options enable: whether the base map has to be added to the map or not
   */
  public addBaseMap(baseMapName, leafletBaseMap: Layer, options?: AddMapOptions) {
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

    // If the cookie did not exist, add the layer to the map if it's enabled.
    const cookieExisted = this.setLayersAccordingToCookie(baseMapName, leafletBaseMap);
    if (options) {
      if (!cookieExisted && options.enable) {
        leafletBaseMap.addTo(this);
      }
    }
  }

  /**
   * Add an overlay map to the map control.
   * When overlay map (with the leafletOverlayMap) is inside the cookies, the cookie value will be used.
   * @param layerName The name shown in the leaflet map control
   * @param leafletOverlayMap The leaflet base map type of Layer
   * @param options enable: whether the base map has to be added to the map or not
   */
  public addOverlayMap(layerName: string, leafletOverlayMap: Layer, options?: AddMapOptions) {
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

    // If the cookie did not exist, add the layer to the map if it's enabled.
    const cookieExisted = this.setLayersAccordingToCookie(layerName, leafletOverlayMap);
    if (options) {
      if (!cookieExisted && options.enable) {
        leafletOverlayMap.addTo(this);
      }
    }
  }

  /**
   * Add the layer to the map according to the value in the cookie
   * @param layerName The name of the map layer, which is used in the cookie
   * @param layer The layer to be added
   */
  private setLayersAccordingToCookie(layerName: string, layer: Layer): boolean {
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

  /**
   * Save the current map control options into the cookies.
   * The current time until cookie expiration is 12 hours.
   */
  private saveMapControlOptions() {
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
