import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
  private paypalOrderData$ = new Subject<PayPalOrderData>();

  get paypalOrder$(): Observable<PayPalOrderData> {
    return this.paypalOrderData$.asObservable();
  }

  // Emits PayPal order data to all subscribers.
  emitPaypalOrderData(data: PayPalOrderData): void {
    this.paypalOrderData$.next(data);
  }
}
