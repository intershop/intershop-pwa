import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { BasketOrderRecurrenceEditComponent } from './basket-order-recurrence-edit.component';

describe('Basket Order Recurrence Edit Component', () => {
  let component: BasketOrderRecurrenceEditComponent;
  let fixture: ComponentFixture<BasketOrderRecurrenceEditComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;
  let canUseBasketForRecurringOrder$: BehaviorSubject<boolean>;

  const recurrence = {
    interval: 'P1W',
    startDate: '2023-01-01',
    endDate: '2029-12-31',
    repetitions: 10,
  };

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    canUseBasketForRecurringOrder$ = new BehaviorSubject<boolean>(true);
    when(checkoutFacadeMock.canUseBasketForRecurringOrder$).thenReturn(canUseBasketForRecurringOrder$);

    await TestBed.configureTestingModule({
      imports: [BasketOrderRecurrenceEditComponent, FormlyTestingModule],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(BasketOrderRecurrenceEditComponent, {
        remove: { imports: [ContentIncludeComponent] },
        add: { imports: [MockComponent(ContentIncludeComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketOrderRecurrenceEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the recurrence form if a recurrence is given', () => {
    component.recurrence = recurrence;
    fixture.detectChanges();

    expect(element.querySelector('#order_recurrence_form').classList).toContain('show'); // expanded
    expect(element.querySelector('form formly-form')).toBeTruthy();
  });

  it('should not show the recurrence form if a recurrence is given', () => {
    component.recurrence = undefined;
    fixture.detectChanges();

    expect(element.querySelector('#order_recurrence_form').classList.contains('show')).toBeFalse(); // collapsed
  });

  it('should call checkoutFacade.updateBasketRecurrence with recurrence data when updateOrderRecurrence is called', () => {
    component.updateOrderRecurrence(recurrence);

    verify(checkoutFacadeMock.updateBasketRecurrence(recurrence)).once();
  });

  it('should call checkoutFacade.updateBasketRecurrence with null when no recurrence is provided', () => {
    component.updateOrderRecurrence(undefined);

    // eslint-disable-next-line unicorn/no-null
    verify(checkoutFacadeMock.updateBasketRecurrence(null)).once();
  });

  it('should show the entire order recurrence section when canUseBasketForRecurringOrder$ returns true', () => {
    component.recurrence = undefined;
    canUseBasketForRecurringOrder$.next(true);
    fixture.detectChanges();

    expect(element.querySelector('#order-recurrence')).toBeTruthy();
    expect(element.querySelector('#order_recurrence_single')).toBeTruthy();
    expect(element.querySelector('#order_recurrence_recurring')).toBeTruthy();
  });

  it('should hide the entire order recurrence section when canUseBasketForRecurringOrder$ returns false', () => {
    component.recurrence = undefined;
    canUseBasketForRecurringOrder$.next(false);
    fixture.detectChanges();

    expect(element.querySelector('#order-recurrence')).toBeFalsy();
    expect(element.querySelector('#order_recurrence_single')).toBeFalsy();
    expect(element.querySelector('#order_recurrence_recurring')).toBeFalsy();
  });

  it('should show the entire order recurrence section even when canUseBasketForRecurringOrder$ returns false if a recurrence is already set', () => {
    component.recurrence = recurrence;
    canUseBasketForRecurringOrder$.next(false);
    fixture.detectChanges();

    expect(element.querySelector('#order-recurrence')).toBeTruthy();
    expect(element.querySelector('#order_recurrence_single')).toBeTruthy();
    expect(element.querySelector('#order_recurrence_recurring')).toBeTruthy();
  });
});
