import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMapTo, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService, BasketUpdateType } from 'ish-core/services/basket/basket.service';
import {
  createCustomerAddressFail,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from 'ish-core/store/customer/addresses';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  assignBasketAddress,
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  loadBasket,
  resetBasketErrors,
  updateBasket,
  updateBasketAddress,
} from './basket.actions';

@Injectable()
export class BasketAddressesEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private basketService: BasketService,
    private addressService: AddressService
  ) {}

  /**
   * Creates a new invoice/shipping address which is assigned to the basket later on
   * if the user is logged in a customer address will be created, otherwise a new basket address will be created
   */
  createAddressForBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketAddress),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),

      mergeMap(([action, customer]) => {
        // create address at customer for logged in user
        if (customer) {
          return this.addressService.createCustomerAddress('-', action.payload.address).pipe(
            map(newAddress => createBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })),
            mapErrorToAction(createCustomerAddressFail)
          );
          // create address at basket for anonymous user
        } else {
          return this.basketService.createBasketAddress(action.payload.address).pipe(
            map(newAddress => createBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })),
            mapErrorToAction(createCustomerAddressFail)
          );
        }
      })
    )
  );

  /**
   * Assigns an address that has just created as basket invoice/shipping address
   */
  assignNewAddressToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketAddressSuccess),
      map(action =>
        assignBasketAddress({
          addressId: action.payload.address.id,
          scope: action.payload.scope,
        })
      )
    )
  );

  /**
   * Assigns the address to the basket according to the scope of the payload.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  assignBasketAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignBasketAddress),
      mapToPayload(),
      map(payload => {
        let body: BasketUpdateType;
        switch (payload.scope) {
          case 'invoice': {
            body = { invoiceToAddress: payload.addressId };
            break;
          }
          case 'shipping': {
            body = { commonShipToAddress: payload.addressId };
            break;
          }
          case 'any': {
            body = { invoiceToAddress: payload.addressId, commonShipToAddress: payload.addressId };
            break;
          }
        }

        return updateBasket({ update: body });
      })
    )
  );

  /**
   * Updates an address (basket or customer) and reloads the basket in case of success.
   */
  updateBasketAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketAddress),
      mapToPayloadProperty('address'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      mergeMap(([address, customer]) => {
        // create address at customer for logged in user
        if (customer) {
          return this.addressService
            .updateCustomerAddress('-', address)
            .pipe(
              concatMapTo([updateCustomerAddressSuccess({ address }), loadBasket(), resetBasketErrors()]),
              mapErrorToAction(updateCustomerAddressFail)
            );
          // create address at basket for anonymous user
        } else {
          return this.basketService
            .updateBasketAddress(address)
            .pipe(
              concatMapTo([updateCustomerAddressSuccess({ address }), loadBasket(), resetBasketErrors()]),
              mapErrorToAction(updateCustomerAddressFail)
            );
        }
      })
    )
  );

  /**
   * Deletes a basket shipping address and reloads the basket in case of success.
   */
  deleteBasketShippingAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketShippingAddress),
      mapToPayloadProperty('addressId'),
      mergeMap(addressId =>
        this.addressService
          .deleteCustomerAddress('-', addressId)
          .pipe(
            concatMapTo([deleteCustomerAddressSuccess({ addressId }), loadBasket()]),
            mapErrorToAction(deleteCustomerAddressFail)
          )
      )
    )
  );
}
