import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodMapper } from 'ish-core/models/payment-method/payment-method.mapper';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';
import { BasketBaseData, BasketData } from '../../models/basket/basket.interface';
import { BasketMapper } from '../../models/basket/basket.mapper';
import { Basket } from '../../models/basket/basket.model';
import { Link } from '../../models/link/link.model';
import { PaymentMethod } from '../../models/payment-method/payment-method.model';
import { ShippingMethod } from '../../models/shipping-method/shipping-method.model';
import { ApiService, unpackEnvelope } from '../api/api.service';

export declare type BasketUpdateType =
  | { invoiceToAddress: string }
  | { commonShipToAddress: string }
  | { commonShippingMethod: string }
  | { calculationState: string };
export declare type BasketItemUpdateType =
  | { quantity?: { value: number }; product?: string }
  | { shippingMethod: { id: string } };
export declare type BasketIncludeType =
  | 'invoiceToAddress'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'lineItems_discounts'
  | 'lineItems'
  | 'payments'
  | 'payments_paymentMethod'
  | 'payments_paymentInstrument';

/**
 * The Basket Service handles the interaction with the 'baskets' REST API.
 */
@Injectable({ providedIn: 'root' })
export class BasketService {
  constructor(private apiService: ApiService) {}

  // declare http header for Basket API v1
  private basketHeaders = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Accept', 'application/vnd.intershop.basket.v1+json');

  private allBasketIncludes: BasketIncludeType[] = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];

  /**
   * Get the basket for the given basket id or fallback to 'current' as basket id to get the current basket for the current user.
   * @param basketId  The basket id.
   * @returns         The basket.
   */
  getBasket(basketId: string = 'current'): Observable<Basket> {
    const params = new HttpParams().set('include', this.allBasketIncludes.join());

    return this.apiService
      .get<BasketData>(`baskets/${basketId}`, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  getBasketByToken(apiToken: string): Observable<Basket> {
    const params = new HttpParams().set('include', this.allBasketIncludes.join());

    return this.apiService
      .get<BasketData>(`baskets/current`, {
        headers: this.basketHeaders.set(ApiService.TOKEN_HEADER_KEY, apiToken),
        params,
        skipApiErrorHandling: true,
        runExclusively: true,
      })
      .pipe(
        map(BasketMapper.fromData),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      );
  }

  /**
   * Creates a basket for the current user.
   * @returns         The basket.
   */
  createBasket(): Observable<Basket> {
    return this.apiService
      .post<BasketData>(
        `baskets`,
        {},
        {
          headers: this.basketHeaders,
        }
      )
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Updates the basket for the given basket id or fallback to 'current' as basket id.
   * @param basketId  The basket id.
   * @param body      Basket related data (invoice address, shipping address, shipping method ...), which should be changed
   * @returns         The changed basket.
   */
  updateBasket(basketId: string = 'current', body: BasketUpdateType): Observable<Basket> {
    if (!body) {
      return throwError('updateBasket() called without body');
    }

    const params = new HttpParams().set('include', this.allBasketIncludes.join());
    return this.apiService
      .patch(`baskets/${basketId}`, body, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Returns the list of active baskets for the current user. The first basket is the last modified basket.
   * Use this method to check if the user has at least one active basket
   * @returns         An array of basket base data.
   */
  getBaskets(): Observable<BasketBaseData[]> {
    return this.apiService
      .get(`baskets`, {
        headers: this.basketHeaders,
      })
      .pipe(unpackEnvelope<BasketBaseData>('data'));
  }

  /**
   * Adds a list of items with the given sku and quantity to the given basket.
   * @param basketId  The id of the basket to add the items to.
   * @param items     The list of product SKU and quantity pairs to be added to the basket.
   */
  addItemsToBasket(basketId: string = 'current', items: { sku: string; quantity: number }[]): Observable<void> {
    if (!items) {
      return throwError('addItemsToBasket() called without items');
    }

    const body = items.map(item => ({
      product: item.sku,
      quantity: {
        value: item.quantity,
      },
    }));

    return this.apiService.post(`baskets/${basketId}/items`, body, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Add quote to basket.
   * @param quoteId   The id of the quote that should be added to basket.
   * @param basketId  The id of the basket which the quote should be added to.
   * @returns         Link to the updated basket items.
   */
  addQuoteToBasket(quoteId: string, basketId: string): Observable<Link> {
    const body = {
      quoteID: quoteId,
    };

    return this.apiService.post(`baskets/${basketId}/items`, body);
  }

  /**
   * Updates specific line items (quantity/shipping method) for the given basket.
   * @param basketId  The id of the basket in which the item should be updated.
   * @param itemId    The id of the line item that should be updated.
   * @param body      request body
   */
  updateBasketItem(basketId: string, itemId: string, body: BasketItemUpdateType): Observable<void> {
    return this.apiService.patch(`baskets/${basketId}/items/${itemId}`, body, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Remove specific line item from the given basket.
   * @param basketId  The id of the basket where the item should be removed.
   * @param itemId    The id of the line item that should be deleted.
   */
  deleteBasketItem(basketId: string, itemId: string): Observable<void> {
    return this.apiService.delete(`baskets/${basketId}/items/${itemId}`, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Create a basket address for the selected basket of an anonymous user.
   * @param basketId  The basket id.
   * @param address   The address which should be created
   * @returns         The new basket address.
   */
  createBasketAddress(basketId: string, address: Address): Observable<Address> {
    if (!basketId) {
      return throwError('createBasketAddress() called without basketId');
    }
    if (!address) {
      return throwError('createBasketAddress() called without address');
    }

    return this.apiService
      .post(`baskets/${basketId}/addresses`, address, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(({ data }) => data),
        map(AddressMapper.fromData)
      );
  }

  /**
   * Updates partly or completely an address for the selected basket of an anonymous user.
   * @param basketId  The basket id.
   * @param address   The address data which should be updated
   * @returns         The new basket address.
   */
  updateBasketAddress(basketId: string, address: Address): Observable<Address> {
    if (!basketId) {
      return throwError('updateBasketAddress() called without basketId');
    }
    if (!address) {
      return throwError('updateBasketAddress() called without address');
    }
    if (!address.id) {
      return throwError('updateBasketAddress() called without addressId');
    }

    return this.apiService
      .patch(`baskets/${basketId}/addresses/${address.id}`, address, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(({ data }) => data),
        map(AddressMapper.fromData)
      );
  }

  /**
   * Get eligible shipping methods for the selected basket.
   * @param basketId  The basket id.
   * @returns         The eligible shipping methods.
   */
  getBasketEligibleShippingMethods(basketId: string): Observable<ShippingMethod[]> {
    if (!basketId) {
      return throwError('getBasketEligibleShippingMethods() called without basketId');
    }

    return this.apiService
      .get(`baskets/${basketId}/eligible-shipping-methods`, {
        headers: this.basketHeaders,
      })
      .pipe(
        unpackEnvelope<ShippingMethodData>('data'),
        map(data => data.map(ShippingMethodMapper.fromData))
      );
  }

  /**
   * Get eligible payment methods for selected basket.
   * @param basketId  The basket id.
   * @returns         The eligible payment methods.
   */
  getBasketEligiblePaymentMethods(basketId: string): Observable<PaymentMethod[]> {
    if (!basketId) {
      return throwError('getBasketEligiblePaymentMethods() called without basketId');
    }

    const params = new HttpParams().set('include', 'paymentInstruments');

    return this.apiService
      .get(`baskets/${basketId}/eligible-payment-methods`, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(PaymentMethodMapper.fromData));
  }

  /**
   * Adds a payment at the selected basket.
   * @param basketId          The basket id.
   * @param paymentInstrument The unique name of the payment method, e.g. ISH_INVOICE
   */
  setBasketPayment(basketId: string, paymentInstrument: string): Observable<string> {
    if (!basketId) {
      return throwError('setBasketPayment() called without basketId');
    }
    if (!paymentInstrument) {
      return throwError('setBasketPayment() called without paymentInstrument');
    }

    const body = {
      paymentInstrument,
    };

    return this.apiService
      .put(`baskets/${basketId}/payments/open-tender`, body, {
        headers: this.basketHeaders,
      })
      .pipe(mapTo(paymentInstrument));
  }

  /**
   * Creates a payment instrument for the selected basket.
   * @param basketId          The basket id.
   * @param paymentInstrument The payment instrument with parameters, id=undefined, paymentMethod= required.
   * @returns                 The created payment instrument.
   */
  createBasketPayment(basketId: string, paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!basketId) {
      return throwError('createBasketPayment() called without basketId');
    }
    if (!paymentInstrument) {
      return throwError('createBasketPayment() called without paymentInstrument');
    }
    if (!paymentInstrument.paymentMethod) {
      return throwError('createBasketPayment() called without paymentMethodId');
    }

    return this.apiService
      .post(`baskets/${basketId}/payment-instruments?include=paymentMethod`, paymentInstrument, {
        headers: this.basketHeaders,
      })
      .pipe(map(({ data }) => data));
  }

  /**
   * Deletes a payment instrument and the related payment from the selected basket.
   * @param basketId          The basket id.
   * @param paymentId         The (uu)id of the payment instrument
   */
  deleteBasketPaymentInstrument(basketId: string, paymentInstrumentId: string): Observable<void> {
    if (!basketId) {
      return throwError('deleteBasketPayment() called without basketId');
    }
    if (!paymentInstrumentId) {
      return throwError('deleteBasketPayment() called without paymentInstrumentId');
    }

    return this.apiService.delete(`baskets/${basketId}/payment-instruments/${paymentInstrumentId}`, {
      headers: this.basketHeaders,
    });
  }
}
