import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface PaypalOrderData {
  paypalOrderId: string;
  orderId?: string;
  paymentInstrumentId?: string;
}

export interface PaypalOrderAuthorizationResult {
  status: 'SUCCESS' | 'ERROR';
  intent?: string;
  message?: string;
}

/**
 * Service to communicate PayPal order data between NgRx effects and PayPal components
 * without triggering Angular change detection.
 */
@Injectable({ providedIn: 'root' })
export class PaypalDataTransferService {
  // Subject that emits PayPal order data when available.
  private paypalOrderData$ = new Subject<PaypalOrderData>();

  // Subject that emits PayPal order authorization result.
  private paypalOrderAuthorizationResultData$ = new Subject<PaypalOrderAuthorizationResult>();

  get paypalOrder$(): Observable<PaypalOrderData> {
    return this.paypalOrderData$.asObservable();
  }

  get paypalOrderAuthorizationResult$(): Observable<PaypalOrderAuthorizationResult> {
    return this.paypalOrderAuthorizationResultData$.asObservable();
  }

  // Emits PayPal order data to all subscribers.
  emitPaypalOrderData(data: PaypalOrderData): void {
    this.paypalOrderData$.next(data);
  }

  // Emits PayPal order data to all subscribers.
  emitPaypalOrderAuthorizationResult(data: PaypalOrderAuthorizationResult): void {
    this.paypalOrderAuthorizationResultData$.next(data);
  }
}
