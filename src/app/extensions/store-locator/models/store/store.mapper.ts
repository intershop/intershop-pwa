import { Injectable } from '@angular/core';

import { StoreData } from './store.interface';
import { Store } from './store.model';

@Injectable({ providedIn: 'root' })
export class StoreMapper {
  fromData(storeData: StoreData): Store {
    if (storeData) {
      return {
        id: storeData.uuid,
        name: storeData.name,
        address: storeData.address,
        city: storeData.city,
        postalCode: storeData.postalCode,
        country: storeData.country,
        countryCode: storeData.countryCode,
        email: storeData.email,
        fax: storeData.fax,
        phone: storeData.phoneBusiness,
        latitude: parseFloat(storeData.latitude),
        longitude: parseFloat(storeData.longitude),
      };
    } else {
      throw new Error(`storeData is required`);
    }
  }
}
