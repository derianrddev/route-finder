import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';

import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'maps-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  public mapDivElement!: ElementRef

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    if ( !this.placesService.userLocation ) throw Error('No user localization');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.placesService.userLocation,
      zoom: 14,
    });

    const popup = new Popup({ closeButton: false })
      .setHTML(`
        <h6 class="text-lg font-semibold">I'm here</h6>
        <span>I am in this place of the world</span>
      `);

    new Marker({ color: 'red' })
      .setLngLat( this.placesService.userLocation )
      .setPopup( popup )
      .addTo( map )

    this.mapService.setMap(map);
  }
}
