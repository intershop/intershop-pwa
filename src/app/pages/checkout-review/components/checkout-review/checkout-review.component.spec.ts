import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from '../../../../shared/address/components/address/address.component';
import { BasketCostSummaryComponent } from '../../../../shared/basket/components/basket-cost-summary/basket-cost-summary.component';
import { LineItemListComponent } from '../../../../shared/basket/components/line-item-list/line-item-list.component';
import { InfoBoxComponent } from '../../../../shared/common/components/info-box/info-box.component';
import { ModalDialogComponent } from '../../../../shared/common/components/modal-dialog/modal-dialog.component';
import { CheckboxComponent } from '../../../../shared/forms/components/checkbox/checkbox.component';

import { CheckoutReviewComponent } from './checkout-review.component';

describe('Checkout Review Component', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(CheckboxComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
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
