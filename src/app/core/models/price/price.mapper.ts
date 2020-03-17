import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { PriceItem } from 'ish-core/models/price-item/price-item.interface';
import { getLoggedInCustomer } from 'ish-core/store/user';

import { Price, PriceType } from './price.model';

/**
 * Maps a price item to a gross or net price.
 * If the price type is not given it is determined by the customer type of the logged in user.
 * price type = 'gross' for private and anonymous users
 * price type = 'net' for business users
 * @param priceItem A price Item.
 * @param priceType The price type (gross/net), optional
 * @returns         The price.
 */
@Injectable({ providedIn: 'root' })
export class PriceMapper {
  private isBusinessCustomer: boolean;

  constructor(store: Store<{}>) {
    store.pipe(select(getLoggedInCustomer)).subscribe(customer => {
      this.isBusinessCustomer = customer && customer.isBusinessCustomer;
    });
  }

  fromPriceItem(dataItem: PriceItem, priceType?: PriceType): Price {
    const pType = priceType || this.isBusinessCustomer ? 'net' : 'gross';
    if (dataItem && dataItem[pType]) {
      return {
        type: 'Money',
        value: dataItem[pType].value,
        currency: dataItem[pType].currency,
      };
    }
  }
}
