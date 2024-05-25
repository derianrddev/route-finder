import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;

  constructor() { }

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap( map: Map ): void {
    this.map = map;
  }

  flyTo( coordinates: LngLatLike ): void {
    if ( !this.isMapReady ) throw Error('The map is not initialized');

    this.map?.flyTo({
      zoom: 14,
      center: coordinates
    });
  }
}
