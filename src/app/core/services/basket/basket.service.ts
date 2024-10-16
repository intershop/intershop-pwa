import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { AddressData } from 'ish-core/models/address/address.interface';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketInfoMapper } from 'ish-core/models/basket-info/basket-info.mapper';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketMergeHelper } from 'ish-core/models/basket-merge/basket-merge.helper';
import { BasketMergeData } from 'ish-core/models/basket-merge/basket-merge.interface';
import { BasketValidationData } from 'ish-core/models/basket-validation/basket-validation.interface';
import { BasketValidationMapper } from 'ish-core/models/basket-validation/basket-validation.mapper';
import { BasketValidation, BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketBaseData, BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { OrderService } from 'ish-core/services/order/order.service';

export type BasketUpdateType =
  | { commonShippingMethod: string }
  | { commonShipToAddress: string }
  | { calculated: boolean }
  | { costCenter: string }
  | { externalOrderReference: string }
  | { invoiceToAddress: string }
  | { messageToMerchant: string }
  | { recurrence: Recurrence };

/**
 * The Basket Service handles the interaction with the 'baskets' REST API.
 * Methods related to basket-items are handled in the basket-items.service.
 * Methods related to the payment are handled in the payment.service.
 */
@Injectable({ providedIn: 'root' })
export class BasketService {
  constructor(private apiService: ApiService, private orderService: OrderService) {}

  /**
   * http header for Basket API v1
   */
  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  private readonly allBasketIncludes = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems',
    'lineItems_discounts',
    'lineItems_warranty',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];

  private readonly allTargetBasketIncludes = [
    'targetBasket',
    'targetBasket_invoiceToAddress',
    'targetBasket_commonShipToAddress',
    'targetBasket_commonShippingMethod',
    'targetBasket_discounts',
    'targetBasket_lineItems',
    'targetBasket_lineItems_discounts',
    'targetBasket_lineItems_warranty',
    'targetBasket_payments',
    'targetBasket_payments_paymentMethod',
    'targetBasket_payments_paymentInstrument',
  ];

  private readonly allBasketValidationIncludes = [
    'basket',
    'basket_invoiceToAddress',
    'basket_commonShipToAddress',
    'basket_commonShippingMethod',
    'basket_discounts',
    'basket_lineItems',
    'basket_lineItems_discounts',
    'basket_lineItems_warranty',
    'basket_payments',
    'basket_payments_paymentMethod',
    'basket_payments_paymentInstrument',
  ];

  /**
   * Gets the currently used basket for the current user.
   *
   * @returns         The basket.
   */
  getBasket(): Observable<Basket> {
    const params = new HttpParams().set('include', this.allBasketIncludes.join());

    return this.apiService
      .currentBasketEndpoint()
      .get<BasketData>('', {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Gets the basket for the current user with the given basket id if available.
   *
   * @param basketId  The basket id for the basket to be fetched.
   * @returns         The basket.
   */
  getBasketWithId(basketId: string): Observable<Basket> {
    const params = new HttpParams().set('include', this.allBasketIncludes.join());

    return this.apiService
      .get<BasketData>(`baskets/${basketId}`, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Gets the 'current' default basket for the current user authenticated by the given apiToken.
   *
   * @param apiToken  The authentication token.
   * @returns         The basket.
   */
  getBasketByToken(apiToken: string): Observable<Basket> {
    const params = new HttpParams().set('include', this.allBasketIncludes.join());

    return this.apiService
      .get<BasketData>(`baskets/current`, {
        headers: this.basketHeaders.set(ApiService.TOKEN_HEADER_KEY, apiToken),
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Creates a new basket for the current user.
   *
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
   * Merge the source basket into the target basket.
   *
   * @param sourceBasketId          The id of the source basket.
   * @param sourceBasketAuthToken   The token value of the source basket owner.
   * @param targetBasketId          The id of the target basket.
   * @returns                       The merged basket.
   */
  mergeBasket(sourceBasketId: string, sourceBasketAuthToken: string, targetBasketId: string): Observable<Basket> {
    if (!sourceBasketId) {
      return throwError(() => new Error('mergeBasket() called without sourceBasketId'));
    }
    if (!sourceBasketAuthToken) {
      return throwError(() => new Error('mergeBasket() called without sourceBasketAuthToken'));
    }
    if (!targetBasketId) {
      return throwError(() => new Error('mergeBasket() called without targetBasketId'));
    }
    if (targetBasketId === sourceBasketId) {
      return throwError(() => new Error('mergeBasket() cannot be called when targetBasketId === sourceBasketId'));
    }

    const params = new HttpParams().set('include', this.allTargetBasketIncludes.join());
    return this.apiService
      .post<BasketMergeData>(
        `baskets/${this.apiService.encodeResourceId(targetBasketId)}/merges`,
        { sourceBasket: sourceBasketId, sourceAuthenticationToken: sourceBasketAuthToken },
        {
          headers: this.basketHeaders,
          params,
        }
      )
      .pipe(map(mergeBasketData => BasketMapper.fromData(BasketMergeHelper.transform(mergeBasketData))));
  }

  /**
   * Updates the currently used basket.
   *
   * @param body      Basket related data (invoice address, shipping address, shipping method ...), which should be changed
   * @returns         The changed basket.
   */
  updateBasket(body: BasketUpdateType): Observable<Basket> {
    if (!body) {
      return throwError(() => new Error('updateBasket() called without body'));
    }

    const params = new HttpParams().set('include', this.allBasketIncludes.join());
    return this.apiService
      .currentBasketEndpoint()
      .patch<BasketData>('', body, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  /**
   * Validates the currently used basket.
   *
   * @param scopes    Basket scopes which should be validated ( see also BasketValidationScopeType ), default: minimal scope (max items limit, empty basket)
   * @returns         The (adjusted) basket and the validation results.
   */
  validateBasket(scopes: BasketValidationScopeType[] = ['']): Observable<BasketValidation> {
    const body = {
      adjustmentsAllowed: !scopes.some(scope => scope === 'All'), // don't allow adjustments for 'All' validation steps, because you cannot show them to the user at once
      scopes,
    };

    const params = new HttpParams().set('include', this.allBasketValidationIncludes.join());
    return this.apiService
      .currentBasketEndpoint()
      .post<BasketValidationData>('validations', body, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(BasketValidationMapper.fromData));
  }

  /**
   * Returns the list of active baskets for the current user. The first basket is the last modified basket.
   * Use this method to check if the user has at least one active basket
   *
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
   * Add a promotion code to currently used basket.
   *
   * @param codeStr   The code string of the promotion code that should be added to basket.
   * @returns         The info message after creation.
   */
  addPromotionCodeToBasket(codeStr: string): Observable<string> {
    const body = { code: codeStr };
    return this.apiService
      .currentBasketEndpoint()
      .post<{ infos: BasketInfo[] }>('promotioncodes', body, {
        headers: this.basketHeaders,
      })
      .pipe(map(({ infos }) => infos?.[0]?.message));
  }

  /**
   * Remove a promotion code from the currently used basket.
   *
   * @param codeStr   The code string of the promotion code that should be removed from basket.
   */
  removePromotionCodeFromBasket(codeStr: string): Observable<string> {
    return this.apiService
      .currentBasketEndpoint()
      .delete<string>(`promotioncodes/${this.apiService.encodeResourceId(codeStr)}`, {
        headers: this.basketHeaders,
      });
  }

  /**
   * Get eligible addresses for the currently used basket.
   *
   * @returns         The eligible addresses.
   */
  getBasketEligibleAddresses(): Observable<Address[]> {
    return this.apiService
      .currentBasketEndpoint()
      .get('eligible-addresses', {
        headers: this.basketHeaders,
      })
      .pipe(
        unpackEnvelope<AddressData>('data'),
        map(addressesData => addressesData.map(AddressMapper.fromData))
      );
  }

  /**
   * Create a basket address for the currently used basket of an anonymous user.
   *
   * @param address   The address which should be created
   * @returns         The new basket address.
   */
  createBasketAddress(address: Address): Observable<Address> {
    if (!address) {
      return throwError(() => new Error('createBasketAddress() called without address'));
    }
    return this.apiService
      .currentBasketEndpoint()
      .post(`addresses`, address, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(({ data }) => data),
        map(AddressMapper.fromData)
      );
  }

  /**
   * Update partly or completely an address for the currently used basket of an anonymous user.
   *
   * @param address   The address data which should be updated
   * @returns         The new basket address.
   */
  updateBasketAddress(address: Address): Observable<Address> {
    if (!address) {
      return throwError(() => new Error('updateBasketAddress() called without address'));
    }
    if (!address.id) {
      return throwError(() => new Error('updateBasketAddress() called without addressId'));
    }
    return this.apiService
      .currentBasketEndpoint()
      .patch<{ data: Address }>(`addresses/${this.apiService.encodeResourceId(address.id)}`, address, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(({ data }) => data),
        map(AddressMapper.fromData)
      );
  }

  /**
   * Get eligible shipping methods for the currently used basket or for the selected bucket of a basket.
   *
   * @param bucketId  The bucket id.
   * @returns         The eligible shipping methods.
   */
  getBasketEligibleShippingMethods(bucketId?: string): Observable<ShippingMethod[]> {
    return bucketId
      ? this.apiService
          .currentBasketEndpoint()
          .get(`buckets/${this.apiService.encodeResourceId(bucketId)}/eligible-shipping-methods`, {
            headers: this.basketHeaders,
          })
          .pipe(
            unpackEnvelope<ShippingMethodData>('data'),
            map(data => data.map(ShippingMethodMapper.fromData))
          )
      : this.apiService
          .currentBasketEndpoint()
          .get('eligible-shipping-methods', {
            headers: this.basketHeaders,
          })
          .pipe(
            unpackEnvelope<ShippingMethodData>('data'),
            map(data => data.map(ShippingMethodMapper.fromData))
          );
  }

  /**
   * Creates a requisition of a certain basket that has to be approved.
   *
   * @param  basketId      Basket id.
   * @returns              nothing
   */
  createRequisition(basketId: string): Observable<void> {
    if (!basketId) {
      return throwError(() => new Error('createRequisition() called without required basketId'));
    }

    return this.orderService.createOrder(basketId, true).pipe(
      concatMap(() => of(undefined)),
      catchError(err => {
        if (err.status === 422) {
          return of(undefined);
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Creates a custom attribute on the currently used basket. Default attribute type is 'String'.
   *
   * @param attr   The custom attribute
   * @returns      The custom attribute
   */
  createBasketAttribute(attr: Attribute): Observable<Attribute> {
    if (!attr) {
      return throwError(() => new Error('createBasketAttribute() called without attribute'));
    }

    // if no type is provided save it as string
    const attribute = { ...attr, type: attr.type ?? 'String' };

    return this.apiService.currentBasketEndpoint().post<Attribute>('attributes', attribute, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Updates a custom attribute on the currently used basket. Default attribute type is 'String'.
   *
   * @param attribute   The custom attribute
   * @returns           The custom attribute
   */
  updateBasketAttribute(attr: Attribute): Observable<Attribute> {
    if (!attr) {
      return throwError(() => new Error('updateBasketAttribute() called without attribute'));
    }

    // if no type is provided save it as string
    const attribute = { ...attr, type: attr.type ?? 'String' };

    return this.apiService
      .currentBasketEndpoint()
      .patch<Attribute>(`attributes/${this.apiService.encodeResourceId(attribute.name)}`, attribute, {
        headers: this.basketHeaders,
      });
  }

  /**
   * Deletes a custom attribute from the currently used basket.
   *
   * @param attributeName The name of the custom attribute
   */
  deleteBasketAttribute(attributeName: string): Observable<unknown> {
    if (!attributeName) {
      return throwError(() => new Error('deleteBasketAttribute() called without attributeName'));
    }
    return this.apiService
      .currentBasketEndpoint()
      .delete(`attributes/${this.apiService.encodeResourceId(attributeName)}`, {
        headers: this.basketHeaders,
      });
  }

  /**
   * Adds all items of a quote to the current basket.
   *
   * @param quoteId   The id of the quote that should be added to the basket.
   * @returns         The info message if present.
   */
  addQuoteToBasket(quoteId: string): Observable<BasketInfo[]> {
    if (!quoteId) {
      return throwError(() => new Error('addQuoteToBasket() called without quoteId'));
    }

    return this.apiService
      .currentBasketEndpoint()
      .post(
        `quotes`,
        { id: quoteId, calculated: true },
        {
          headers: this.basketHeaders,
        }
      )
      .pipe(map(BasketInfoMapper.fromInfo));
  }

  /**
   * Deletes all items of a quote from the current basket.
   *
   * @param quoteId   The id of the quote whose items should be deleted from the basket.
   * @returns         The info message if present.
   */
  deleteQuoteFromBasket(quoteId: string): Observable<BasketInfo[]> {
    if (!quoteId) {
      return throwError(() => new Error('deleteQuoteFromBasket() called without quoteId'));
    }

    return this.apiService
      .currentBasketEndpoint()
      .delete(`quotes/${this.apiService.encodeResourceId(quoteId)}`, {
        headers: this.basketHeaders,
      })
      .pipe(map(BasketInfoMapper.fromInfo));
  }
}
