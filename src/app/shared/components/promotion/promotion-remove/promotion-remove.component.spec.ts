import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';

import { PromotionRemoveComponent } from './promotion-remove.component';

describe('Promotion Remove Component', () => {
  let component: PromotionRemoveComponent;
  let fixture: ComponentFixture<PromotionRemoveComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of({} as BasketView));

    await TestBed.configureTestingModule({
      declarations: [PromotionRemoveComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRemoveComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.code = 'test';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the link and input field on component', () => {
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(element.querySelector('[data-testing-id=promo-remove-link]')).toBeTruthy();
  });
});
