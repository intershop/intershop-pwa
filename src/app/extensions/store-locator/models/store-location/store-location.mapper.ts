import { Injectable } from '@angular/core';

import { StoreLocationData } from './store-location.interface';
import { StoreLocation } from './store-location.model';

@Injectable({ providedIn: 'root' })
export class StoreLocationMapper {
  fromData(data: StoreLocationData): StoreLocation {
    if (data) {
      return {
        id: data.uuid,
        name: data.name,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        countryCode: data.countryCode,
        email: data.email,
        fax: data.fax,
        phone: data.phoneBusiness,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    } else {
      throw new Error(`storeData is required`);
    }
  }
}
