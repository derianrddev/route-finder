import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';

import { Feature } from '../interfaces/places.interface';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];
  private currentPopup: Popup | null = null;

  constructor( private directionsApi: DirectionsApiClient ) { }

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

  createMarkersFromPlaces( places: Feature[], userLocation: [number, number] ): void {
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

  getRouteBetweenPoints( start: [number, number], end: [number, number] ): void {
    this.directionsApi.get<DirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`)
      .subscribe( response => this.drawRoute( response.routes[0] ) );
  }

  drawRoute( route: Route ): void {
    if ( !this.map ) throw Error('Map not initialized');

    const coordinates = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coordinates.forEach( ([ lng, lat ]) => {
      bounds.extend([ lng, lat ]);
    });

    this.map?.fitBounds( bounds, {
      padding: 200
    });

    // Route
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        ]
      }
    }

    if ( this.map.getLayer('RouteString') ) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData );

    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join':'round'
      },
      paint: {
        'line-color': 'blue',
        'line-width': 3
      }
    });

    // Adding popup at the midpoint of the route
    const midpointIndex = Math.floor(coordinates.length / 2);
    const midpoint = coordinates[midpointIndex] as LngLatLike;

    if (this.currentPopup) {
      this.currentPopup.remove();
    }

    this.currentPopup = new Popup({ offset: 25, closeButton: false })
      .setLngLat(midpoint)
      .setHTML(`
        <h3 class="text-lg font-medium">Route Information</h3>
        <p class="text-sm text-gray-500">Distance: ${(route.distance / 1000).toFixed(2)} km<br>Duration: ${(route.duration / 60).toFixed(2)} mins</p>
      `)
      .addTo(this.map);
  }
}
