import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface PayPalOrderData {
  orderId: string;
  paymentInstrumentId: string;
}

/**
 * Service to communicate PayPal order data between NgRx effects and PayPal components
 * without triggering Angular change detection.
 *
 * This service acts as a side-channel for data that needs to be passed
 * outside of the normal NgRx store flow to avoid change detection issues
 * with PayPal SDK iframes.
 */
@Injectable({ providedIn: 'root' })
export class PayPalDataTransferService {
  /**
   * Subject that emits PayPal order data when available.
   * Components can subscribe to this to receive order data without
   * triggering change detection through the NgRx store.
   */
  private orderData$ = new Subject<PayPalOrderData>();

  /**
   * Observable stream of PayPal order data.
   * Subscribe to this in components that need to receive order data.
   */
  get orderDataStream$() {
    return this.orderData$.asObservable();
  }

  /**
   * Emits PayPal order data to all subscribers.
   * Called from NgRx effects after successful order creation.
   *
   * @param data The PayPal order data containing orderId and paymentInstrumentId
   */
  emitOrderData(data: PayPalOrderData): void {
    this.orderData$.next(data);
  }
}
