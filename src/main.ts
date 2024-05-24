import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import mapboxgl from 'mapbox-gl';
import { environments } from './environments/environments';

mapboxgl.accessToken = environments.mapbox_key;

if ( !navigator.geolocation ) {
  alert('Browser does not support Geolocation');
  throw new Error('Browser does not support Geolocation');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
