import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { MessageFacade } from 'ish-core/facades/message.facade';

import { ShoppingBasketErrorMessageComponent } from './shopping-basket-error-message.component';

describe('Shopping Basket Error Message Component', () => {
  let component: ShoppingBasketErrorMessageComponent;
  let fixture: ComponentFixture<ShoppingBasketErrorMessageComponent>;
  let element: HTMLElement;
  let messageFacade: MessageFacade;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    messageFacade = mock(MessageFacade);
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: MessageFacade, useFactory: () => instance(messageFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.basketError$).thenReturn(of(undefined));
    when(checkoutFacade.basketInfoError$).thenReturn(of(undefined));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
