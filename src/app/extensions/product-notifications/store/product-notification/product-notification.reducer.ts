import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

import { productNotificationsActions, productNotificationsApiActions } from './product-notification.actions';

export const productNotificationAdapter = createEntityAdapter<ProductNotification>();

export interface ProductNotificationState extends EntityState<ProductNotification> {
  loading: boolean;
  error: HttpError;
}

export const initialState: ProductNotificationState = productNotificationAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const productNotificationReducer = createReducer(
  initialState,
  setLoadingOn(
    productNotificationsActions.loadProductNotifications,
    productNotificationsActions.createProductNotification,
    productNotificationsActions.updateProductNotification,
    productNotificationsActions.deleteProductNotification
  ),
  setErrorOn(
    productNotificationsApiActions.loadProductNotificationsFail,
    productNotificationsApiActions.createProductNotificationFail,
    productNotificationsApiActions.updateProductNotificationFail,
    productNotificationsApiActions.deleteProductNotificationFail
  ),
  unsetLoadingAndErrorOn(
    productNotificationsApiActions.loadProductNotificationsSuccess,
    productNotificationsApiActions.createProductNotificationSuccess,
    productNotificationsApiActions.updateProductNotificationSuccess,
    productNotificationsApiActions.deleteProductNotificationSuccess
  ),
  on(productNotificationsApiActions.loadProductNotificationsSuccess, (state, action) =>
    /**
     * Product notifications can be deleted on server side when the notification requirements
     * are met and the notification email was sent. Therefore, all product notifications
     * have to be removed from the state which are not returned from the service before they
     * are loaded, displayed or used. If setAll would be used, the list of notifications would
     * always be empty at first and only filled when the REST request has finished.
     */
    productNotificationAdapter.upsertMany(action.payload.productNotifications, {
      ...productNotificationAdapter.removeMany(entity => entity.type === action.payload.type, state),
    })
  ),
  on(productNotificationsApiActions.createProductNotificationSuccess, (state, action) =>
    productNotificationAdapter.addOne(action.payload.productNotification, state)
  ),
  on(productNotificationsApiActions.updateProductNotificationSuccess, (state, action) =>
    productNotificationAdapter.upsertOne(action.payload.productNotification, state)
  ),
  on(productNotificationsApiActions.deleteProductNotificationSuccess, (state, action) => {
    const id = action.payload.productNotificationId;

    return {
      ...productNotificationAdapter.removeOne(id, state),
    };
  })
);
