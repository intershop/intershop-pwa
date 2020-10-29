import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReceiptPageComponent } from './checkout-receipt-page.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

describe('Checkout Receipt Page Component', () => {
  let component: CheckoutReceiptPageComponent;
  let fixture: ComponentFixture<CheckoutReceiptPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptPageComponent,
        MockComponent(CheckoutReceiptComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
