import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'maps-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent {
  constructor(private placesService: PlacesService) {}

  get isUserLocationReady(): boolean {
    return this.placesService.isUserLocationReady;
  }
}
