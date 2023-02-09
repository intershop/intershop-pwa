import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { BasketMerchantMessageComponent } from './basket-merchant-message.component';

describe('Basket Merchant Message Component', () => {
  let component: BasketMerchantMessageComponent;
  let fixture: ComponentFixture<BasketMerchantMessageComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [BasketMerchantMessageComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketMerchantMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.setBasketCustomAttribute(anything())).thenReturn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display message to merchant field on form', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('messageToMerchant');
  });

  it('should read the  message to merchant from the basket', () => {
    component.basket = {
      messageToMerchant: 'please deliver soon',
    } as Basket;

    fixture.detectChanges();
    component.ngOnChanges({ basket: new SimpleChange(undefined, component.basket, false) });

    expect(component.model.messageToMerchant).toBe('please deliver soon');
  });
});
