import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
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
      declarations: [BasketDesiredDeliveryDateComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketDesiredDeliveryDateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.basket = {
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-03-17' }],
    } as Basket;

    when(checkoutFacade.setDesiredDeliveryDate(anything())).thenReturn();
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

  it('should not display desired delivery date input fields for recurring order', () => {
    component.basket = {
      recurrence: { interval: 'P7M' },
      attributes: [{ name: 'desiredDeliveryDate', value: '2022-03-17' }],
    } as Basket;
    fixture.detectChanges();
    expect(element.innerHTML).not.toContain('desiredDeliveryDate');
  });

  it('should show current desired delivery date from the store', () => {
    fixture.detectChanges();
    component.ngOnChanges({ basket: new SimpleChange(undefined, component.basket, false) });

    expect(component.model.desiredDeliveryDate?.toISOString()).toMatch(/^2022-03-17/);
  });

  it('should call setDesiredDeliveryDate if submit form is called', () => {
    fixture.detectChanges();
    component.submitForm();
    verify(checkoutFacade.setDesiredDeliveryDate(anything())).once();
  });
});
