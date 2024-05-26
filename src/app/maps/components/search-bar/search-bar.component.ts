import { Component } from '@angular/core';

import { PlacesService } from '../../services';

@Component({
  selector: 'maps-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  private debounceTimer?: NodeJS.Timeout;

  constructor( private placesService: PlacesService ) { }

  onQueryChanged( query: string = '' ): void {
    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery( query );
    }, 350 );
  }
}
