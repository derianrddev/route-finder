import { Component } from '@angular/core';

import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'maps-btn-my-location',
  templateUrl: './btn-my-location.component.html'
})
export class BtnMyLocationComponent {
  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) { }

  goToMyLocation(): void {
    if ( !this.placesService.isUserLocationReady ) throw Error('No user location');
    if ( !this.mapService.isMapReady ) throw Error('No map available');

    this.mapService.flyTo(this.placesService.userLocation!);
  }
}
