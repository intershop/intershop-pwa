import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';

import { BasketInfoComponent } from './basket-info.component';

describe('Basket Info Component', () => {
  let component: BasketInfoComponent;
  let fixture: ComponentFixture<BasketInfoComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketInfo$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [BasketInfoComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display a message if there are no info messages', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=info-messages]')).toBeFalsy();
  });

  it('should display a message if there is an info message', () => {
    const infoMessage = { message: 'info message', causes: [{ message: 'cause1' }] } as BasketInfo;

    when(checkoutFacadeMock.basketInfo$).thenReturn(of([infoMessage]));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=info-messages]')).toBeTruthy();
    expect(element).toMatchInlineSnapshot(`
      <div class="alert alert-info" data-testing-id="info-messages">
        info message
        <p>cause1</p>
      </div>
    `);
  });

  it('should not display a cause message if there is a line item info message', () => {
    const infoMessage = {
      message: 'info message',
      causes: [{ message: 'cause1', parameters: { lineItemId: '5432' } }],
    } as BasketInfo;

    when(checkoutFacadeMock.basketInfo$).thenReturn(of([infoMessage]));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(
      `<div class="alert alert-info" data-testing-id="info-messages">info message</div>`
    );
  });
});
