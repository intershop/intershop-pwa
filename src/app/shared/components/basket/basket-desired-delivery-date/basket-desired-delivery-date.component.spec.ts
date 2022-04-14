import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { SuccessMessageComponent } from 'ish-shared/components/common/success-message/success-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { BasketDesiredDeliveryDateComponent } from './basket-desired-delivery-date.component';

describe('Basket Desired Delivery Date Component', () => {
  let component: BasketDesiredDeliveryDateComponent;
  let fixture: ComponentFixture<BasketDesiredDeliveryDateComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [BasketDesiredDeliveryDateComponent, MockComponent(SuccessMessageComponent)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketDesiredDeliveryDateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.setBasketCustomAttribute(anything())).thenReturn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display desired delivery date input fields on form', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('desiredDeliveryDate');
  });

  it('should show current desired delivery date from the store', () => {
    component.basket = {
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-3-17' }],
    } as Basket;

    fixture.detectChanges();
    component.ngOnChanges({ basket: new SimpleChange(undefined, component.basket, false) });

    expect(component.model.desiredDeliveryDate).toBe('2022-3-17');
  });

  it('should show success message after successful delivery date change', () => {
    const prev = {
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-3-17' }],
    } as Basket;
    const post = {
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-3-18' }],
    } as Basket;
    component.basket = prev;
    component.ngOnChanges({ basket: new SimpleChange(prev, post, false) });
    fixture.detectChanges();
    expect(element.querySelector('ish-success-message')).toBeTruthy();
  });
});
