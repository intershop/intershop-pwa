import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMapTo, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService, BasketUpdateType } from 'ish-core/services/basket/basket.service';
import {
  CreateCustomerAddressFail,
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  UpdateCustomerAddressFail,
  UpdateCustomerAddressSuccess,
} from 'ish-core/store/account/addresses';
import { getLoggedInCustomer } from 'ish-core/store/account/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  AssignBasketAddress,
  BasketActionTypes,
  CreateBasketAddress,
  CreateBasketAddressSuccess,
  DeleteBasketShippingAddress,
  LoadBasket,
  ResetBasketErrors,
  UpdateBasket,
  UpdateBasketAddress,
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
  @Effect()
  createAddressForBasket$ = this.actions$.pipe(
    ofType<CreateBasketAddress>(BasketActionTypes.CreateBasketAddress),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),

    mergeMap(([action, customer]) => {
      // create address at customer for logged in user
      if (customer) {
        return this.addressService.createCustomerAddress('-', action.payload.address).pipe(
          map(newAddress => new CreateBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })),
          mapErrorToAction(CreateCustomerAddressFail)
        );
        // create address at basket for anonymous user
      } else {
        return this.basketService.createBasketAddress('current', action.payload.address).pipe(
          map(newAddress => new CreateBasketAddressSuccess({ address: newAddress, scope: action.payload.scope })),
          mapErrorToAction(CreateCustomerAddressFail)
        );
      }
    })
  );

  /**
   * Assigns an address that has just created as basket invoice/shipping address
   */
  @Effect()
  assignNewAddressToBasket$ = this.actions$.pipe(
    ofType<CreateBasketAddressSuccess>(BasketActionTypes.CreateBasketAddressSuccess),
    map(
      action =>
        new AssignBasketAddress({
          addressId: action.payload.address.id,
          scope: action.payload.scope,
        })
    )
  );

  /**
   * Assigns the address to the basket according to the scope of the payload.
   * Triggers the internal UpdateBasket action that handles the actual updating operation.
   */
  @Effect()
  assignBasketAddress$ = this.actions$.pipe(
    ofType<AssignBasketAddress>(BasketActionTypes.AssignBasketAddress),
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

      return new UpdateBasket({ update: body });
    })
  );

  /**
   * Updates an address (basket or customer) and reloads the basket in case of success.
   */
  @Effect()
  updateBasketAddress$ = this.actions$.pipe(
    ofType<UpdateBasketAddress>(BasketActionTypes.UpdateBasketAddress),
    mapToPayloadProperty('address'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    mergeMap(([address, customer]) => {
      // create address at customer for logged in user
      if (customer) {
        return this.addressService
          .updateCustomerAddress('-', address)
          .pipe(
            concatMapTo([new UpdateCustomerAddressSuccess({ address }), new LoadBasket(), new ResetBasketErrors()]),
            mapErrorToAction(UpdateCustomerAddressFail)
          );
        // create address at basket for anonymous user
      } else {
        return this.basketService
          .updateBasketAddress('current', address)
          .pipe(
            concatMapTo([new UpdateCustomerAddressSuccess({ address }), new LoadBasket(), new ResetBasketErrors()]),
            mapErrorToAction(UpdateCustomerAddressFail)
          );
      }
    })
  );

  /**
   * Deletes a basket shipping address and reloads the basket in case of success.
   */
  @Effect()
  deleteBasketShippingAddress$ = this.actions$.pipe(
    ofType<DeleteBasketShippingAddress>(BasketActionTypes.DeleteBasketShippingAddress),
    mapToPayloadProperty('addressId'),
    mergeMap(addressId =>
      this.addressService
        .deleteCustomerAddress('-', addressId)
        .pipe(
          concatMapTo([new DeleteCustomerAddressSuccess({ addressId }), new LoadBasket()]),
          mapErrorToAction(DeleteCustomerAddressFail)
        )
    )
  );
}
