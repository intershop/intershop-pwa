import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { StoreLocationData } from '../../models/store-location/store-location.interface';
import { StoreLocationMapper } from '../../models/store-location/store-location.mapper';

@Injectable({ providedIn: 'root' })
export class StoresService {
  constructor(private apiService: ApiService, private storeLocationMapper: StoreLocationMapper) {}

  getStores(countryCode?: string, postalCode?: string, city?: string) {
    let params = new HttpParams();
    if (countryCode) {
      params = params.set('countryCode', countryCode);
    }
    if (postalCode) {
      params = params.set('postalCode', postalCode);
    }
    if (city) {
      params = params.set('city', city);
    }

    return this.apiService.get('stores', { params }).pipe(
      unpackEnvelope(),
      map((stores: StoreLocationData[]) => stores.map(store => this.storeLocationMapper.fromData(store)))
    );
  }
}
