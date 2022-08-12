import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Store, select } from '@ngrx/store';

import { StoreLocationHelper } from '../../models/store-location/store-location.helper';
import { StoreLocation } from '../../models/store-location/store-location.model';
import { getGMAKey } from '../../store/store-locator-config';
import { getHighlightedStore, getStores, highlightStore } from '../../store/stores';

type IconConfiguration = { default: string; highlight: string };

export const STORE_MAP_ICON_CONFIGURATION = new InjectionToken<IconConfiguration>('Store Map Icon Configuration');

@Injectable({ providedIn: 'root' })
export class StoresMapService {
  private map: google.maps.Map;
  private infoWindow: google.maps.InfoWindow;
  private entries: { store: StoreLocation; marker: google.maps.Marker }[] = [];

  constructor(private store: Store, @Inject(STORE_MAP_ICON_CONFIGURATION) private icons: IconConfiguration) {}

  initialize(container: HTMLElement) {
    this.store.pipe(select(getGMAKey)).subscribe((gmaKey: string) => {
      this.initializeMap(container, gmaKey);
    });
  }

  private initializeMap(container: HTMLElement, gmaKey: string) {
    const loader = new Loader({
      apiKey: gmaKey,
      version: 'weekly',
    });
    loader.load().then(() => {
      this.map = new google.maps.Map(container, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        minZoom: 2,
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        streetViewControl: false,
      });
      this.infoWindow = new google.maps.InfoWindow();
      this.store.pipe(select(getStores)).subscribe(stores => {
        this.placeMarkers(stores.filter(store => store.longitude && store.latitude));
      });
      this.store.pipe(select(getHighlightedStore)).subscribe(data => {
        this.highlightMarkers(data);
      });
    });
  }

  private placeMarkers(stores: StoreLocation[]) {
    this.entries.forEach(entry => {
      entry.marker.setMap(undefined);
    });
    this.entries = [];
    const bounds = new google.maps.LatLngBounds();
    stores.forEach(store => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat: store.latitude, lng: store.longitude },
        icon: this.icons?.default,
      });
      bounds.extend(marker.getPosition());
      marker.addListener('click', () => {
        this.store.dispatch(highlightStore({ storeId: store.id }));
      });
      this.entries.push({ store, marker });
    });
    this.map.fitBounds(bounds);
  }

  private highlightMarkers(store: StoreLocation) {
    this.entries.forEach(entry => {
      if (StoreLocationHelper.equal(entry.store, store)) {
        entry.marker.setIcon(this.icons?.highlight);
        entry.marker.setZIndex(1);
        this.map.panTo(entry.marker.getPosition());
        this.infoWindow.close();
        this.infoWindow.setContent(entry.store.name);
        this.infoWindow.open({
          map: this.map,
          anchor: entry.marker,
        });
      } else {
        entry.marker.setIcon(this.icons?.default);
        entry.marker.setZIndex(0);
      }
    });
  }
}
