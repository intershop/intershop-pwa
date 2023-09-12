import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, spy, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { LineItemExtendedContentEditComponent } from './line-item-extended-content-edit.component';

describe('Line Item Extended Content Edit Component', () => {
  let component: LineItemExtendedContentEditComponent;
  let fixture: ComponentFixture<LineItemExtendedContentEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineItemExtendedContentEditComponent],
      imports: [FormlyTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.showExtendAttributeForm = true;
    component.lineItem = BasketMockData.getBasketItem();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initial not render formly field', () => {
    component.showExtendAttributeForm = false;
    fixture.detectChanges();

    expect(element.innerHTML.match(/ish-text-input-field/g)).toBeNull();
    expect(element.innerHTML).not.toContain('partialOrderNo');
    expect(element.innerHTML).not.toContain('customerProductID');

    expect(element.querySelector('button[class="btn btn-secondary"]')).toBeFalsy();
  });

  it('should render formly field if show more applied', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match(/ish-text-input-field/g)).toHaveLength(2);
    expect(element.innerHTML).toContain('partialOrderNo');
    expect(element.innerHTML).toContain('customerProductID');

    expect(element.querySelector('button[class="btn btn-secondary"]')).toBeTruthy();
  });

  it('should emit values if form is valid', () => {
    const checkoutFacade = spy(component.checkoutFacade);
    fixture.detectChanges();

    const form = component.extendedAttributesForm as FormGroup;

    form.get('partialOrderNo').setValue('testPartialOrderNo');
    form.get('customerProductID').setValue('testCustomerProductID');
    component.onSubmit();

    verify(checkoutFacade.updateBasketItem(anything())).once();
  });
});
