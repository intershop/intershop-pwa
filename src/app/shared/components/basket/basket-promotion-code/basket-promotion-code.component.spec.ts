import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { BasketPromotionCodeComponent } from './basket-promotion-code.component';

describe('Basket Promotion Code Component', () => {
  let component: BasketPromotionCodeComponent;
  let fixture: ComponentFixture<BasketPromotionCodeComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [BasketPromotionCodeComponent, MockComponent(NgbCollapse)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketPromotionCodeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the link, input field and the apply button on component', () => {
    expect(element.querySelector('a[data-testing-id=promo-collapse-link]')).toBeTruthy();
    expect(element.querySelector('input')).toBeTruthy();
    expect(element.querySelector('button')).toBeTruthy();
  });
});
