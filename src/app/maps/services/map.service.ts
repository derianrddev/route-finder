import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';

import { Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

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

  createMarkersFromPlaces( places: Feature[], userLocation: [number, number] ) {
    if ( !this.map ) throw Error('Map not initialized');

    this.markers.forEach( marker => marker.remove() );
    const newMarkers = [];

    for (const place of places) {
      const [ lng, lat ] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6 class="text-lg font-semibold">${ place.text }</h6>
          <span>${ place.place_name }</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup( popup )
        .addTo( this.map );

      newMarkers.push( newMarker );
    }

    this.markers = newMarkers;

    if( this.markers.length === 0 ) return;

    // Map limits
    const bounds = new LngLatBounds();
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ) );
    bounds.extend( userLocation );

    this.map.fitBounds(bounds, {
      padding: 200
    });
  }
}
