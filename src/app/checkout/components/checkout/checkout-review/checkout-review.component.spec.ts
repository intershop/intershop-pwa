import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { HttpError } from '../../../../models/http-error/http-error.model';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { CheckoutReviewComponent } from './checkout-review.component';

describe('Checkout Review Component', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewComponent,
        MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component', inputs: ['options'] }),
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-info-box',
          template: 'Checkout Infobox Component',
          inputs: ['heading', 'editRouterLink'],
        }),
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems', 'editable'],
        }),
        MockComponent({
          selector: 'ish-checkbox',
          template: 'Checkbox Component',
          inputs: ['form', 'controlName', 'errorMessages'],
        }),
      ],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit an event if t&c checkbox is checked', done => {
    component.createOrder.subscribe(basket => {
      expect(basket.id).toEqual(component.basket.id);
      done();
    });
    fixture.detectChanges();
    component.form.get('termsAndConditions').setValue('true');
    component.submitOrder();
  });

  it('should not emit an event if t&c checkbox is empty', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.submitOrder();
    verify(emitter.emit(anything())).never();
  });

  it('should display a message if an error occurs', () => {
    component.error = { status: 400, error: 'Bad request' } as HttpError;
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });
});
