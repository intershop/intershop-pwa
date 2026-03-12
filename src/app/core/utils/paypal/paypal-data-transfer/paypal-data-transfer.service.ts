import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface PaypalOrderData {
  paypalOrderId: string;
  orderId?: string;
  paymentInstrumentId?: string;
}

/**
 * Service to communicate PayPal order data between NgRx effects and PayPal components
 * without triggering Angular change detection.
 */
@Injectable({ providedIn: 'root' })
export class PaypalDataTransferService {
  // Subject that emits PayPal order data when available.
  private paypalOrderData$ = new Subject<PaypalOrderData>();

  get paypalOrder$(): Observable<PaypalOrderData> {
    return this.paypalOrderData$.asObservable();
  }

  // Emits PayPal order data to all subscribers.
  emitPaypalOrderData(data: PaypalOrderData): void {
    this.paypalOrderData$.next(data);
  }
}
