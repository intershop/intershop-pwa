import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { BasketOrderReferenceComponent } from './basket-order-reference.component';

describe('Basket Order Reference Component', () => {
  let component: BasketOrderReferenceComponent;
  let fixture: ComponentFixture<BasketOrderReferenceComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [BasketOrderReferenceComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketOrderReferenceComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.setBasketCustomAttribute(anything())).thenReturn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display order reference id input fields on form', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('orderReferenceId');
  });

  it('should read the order reference id from the basket', () => {
    component.basket = {
      attributes: [{ name: 'orderReferenceID', value: '4711' }],
    } as Basket;

    fixture.detectChanges();
    component.ngOnChanges({ basket: new SimpleChange(undefined, component.basket, false) });

    expect(component.model.orderReferenceId).toBe('4711');
  });

  it('should emit form when a valid form is submitted', () => {
    fixture.detectChanges();

    component.form = new UntypedFormGroup({
      orderReferenceId: new FormControl('xxx', SpecialValidators.noSpecialChars),
    });
    component.submitForm();

    verify(checkoutFacade.setBasketCustomAttribute(anything())).once();
  });

  it('should not emit form when an invalid form is submitted', () => {
    fixture.detectChanges();

    component.form = new UntypedFormGroup({
      orderReferenceId: new FormControl('%%%', SpecialValidators.noSpecialChars),
    });
    component.submitForm();

    verify(checkoutFacade.setBasketCustomAttribute(anything())).never();
  });
});
