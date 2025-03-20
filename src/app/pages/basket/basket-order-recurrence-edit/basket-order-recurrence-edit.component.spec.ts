import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { BasketOrderRecurrenceEditComponent } from './basket-order-recurrence-edit.component';

describe('Basket Order Recurrence Edit Component', () => {
  let component: BasketOrderRecurrenceEditComponent;
  let fixture: ComponentFixture<BasketOrderRecurrenceEditComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BasketOrderRecurrenceEditComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketOrderRecurrenceEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new UntypedFormGroup({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call checkoutFacade.updateBasketRecurrence with recurrence data when updateOrderRecurrence is called', () => {
    const recurrence: { interval: string; startDate: string; endDate?: string; repetitions?: number } = {
      interval: 'P1W',
      startDate: '2023-01-01',
      endDate: undefined,
      repetitions: undefined,
    };

    component.updateOrderRecurrence(recurrence);

    verify(checkoutFacadeMock.updateBasketRecurrence(recurrence)).once();
  });

  it('should checkoutFacade.updateBasketRecurrence with null when no recurrence is provided', () => {
    component.updateOrderRecurrence(undefined);
    fixture.detectChanges();

    // eslint-disable-next-line unicorn/no-null
    verify(checkoutFacadeMock.updateBasketRecurrence(null)).once();
  });
});
