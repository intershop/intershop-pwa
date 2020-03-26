import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { PriceItem } from 'ish-core/models/price-item/price-item.interface';
import { getConfigParameter } from 'ish-core/store/configuration';
import { getLoggedInCustomer } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';

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
  private isLoggedIn: boolean;
  private privateCustomerPriceDisplayType: PriceType = 'gross';
  private smbCustomerPriceDisplayType: PriceType = 'net';
  private defaultCustomerTypeForPriceDisplay = 'PRIVATE';

  constructor(store: Store<{}>) {
    store.pipe(select(getLoggedInCustomer)).subscribe(customer => {
      this.isBusinessCustomer = customer && customer.isBusinessCustomer;
      this.isLoggedIn = !!customer;
    });

    store
      .pipe(
        select(getConfigParameter('pricing', 'privateCustomerPriceDisplayType')),
        whenTruthy(),
        take(1)
      )
      .subscribe((param: PriceType) => {
        this.privateCustomerPriceDisplayType = param || this.privateCustomerPriceDisplayType;
      });
    store
      .pipe(
        select(getConfigParameter('pricing', 'smbCustomerPriceDisplayType')),
        whenTruthy(),
        take(1)
      )
      .subscribe((param: PriceType) => {
        this.smbCustomerPriceDisplayType = param || this.smbCustomerPriceDisplayType;
      });
    store
      .pipe(
        select(getConfigParameter('pricing', 'defaultCustomerTypeForPriceDisplay')),
        whenTruthy(),
        take(1)
      )
      .subscribe(param => {
        this.defaultCustomerTypeForPriceDisplay = param || this.defaultCustomerTypeForPriceDisplay;
      });
  }

  fromPriceItem(dataItem: PriceItem, priceType?: PriceType): Price {
    const pType =
      priceType ||
      this.determinePriceType(
        this.isLoggedIn ? this.isBusinessCustomer : this.defaultCustomerTypeForPriceDisplay !== 'PRIVATE'
      );
    if (dataItem && dataItem[pType]) {
      return {
        type: 'Money',
        priceType: pType,
        value: dataItem[pType].value,
        currency: dataItem[pType].currency,
      };
    }
  }

  private determinePriceType(isBusinessCustomer: boolean): PriceType {
    return isBusinessCustomer ? this.smbCustomerPriceDisplayType : this.privateCustomerPriceDisplayType;
  }
}
