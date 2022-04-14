import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { QuotingFacade } from '../../facades/quoting.facade';

import { QuotingBasketLineItemsComponent } from './quoting-basket-line-items.component';

describe('Quoting Basket Line Items Component', () => {
  let component: QuotingBasketLineItemsComponent;
  let fixture: ComponentFixture<QuotingBasketLineItemsComponent>;
  let element: HTMLElement;

  let checkoutFacade: CheckoutFacade;
  let quotingFacade: QuotingFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    quotingFacade = mock(QuotingFacade);
    when(checkoutFacade.basket$).thenReturn(EMPTY);
    await TestBed.configureTestingModule({
      declarations: [QuotingBasketLineItemsComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotingBasketLineItemsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
