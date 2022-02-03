import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { StoreData } from '../../models/store/store.interface';
import { StoreMapper } from '../../models/store/store.mapper';

@Injectable({ providedIn: 'root' })
export class StoresService {
  constructor(private apiService: ApiService, private storeMapper: StoreMapper) {}

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
      map((stores: StoreData[]) => stores.map(store => this.storeMapper.fromData(store)))
    );
  }
}
