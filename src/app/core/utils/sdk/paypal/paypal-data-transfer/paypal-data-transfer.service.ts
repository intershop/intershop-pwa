import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface PayPalOrderData {
  orderId: string;
  paymentInstrumentId: string;
}

/**
 * Service to communicate PayPal order data between NgRx effects and PayPal components
 * without triggering Angular change detection.
 */
@Injectable({ providedIn: 'root' })
export class PayPalDataTransferService {
  // Subject that emits PayPal order data when available.
  private orderData$ = new Subject<PayPalOrderData>();

  get orderDataStream$() {
    return this.orderData$.asObservable();
  }

  // Emits PayPal order data to all subscribers.
  emitOrderData(data: PayPalOrderData): void {
    this.orderData$.next(data);
  }
}
