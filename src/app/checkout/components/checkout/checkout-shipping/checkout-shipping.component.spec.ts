import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { IconModule } from '../../../../core/icon.module';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { HttpError } from '../../../../models/http-error/http-error.model';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { CheckoutShippingComponent } from './checkout-shipping.component';

describe('Checkout Shipping Component', () => {
  let component: CheckoutShippingComponent;
  let fixture: ComponentFixture<CheckoutShippingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutShippingComponent,
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-basket-items-summary',
          template: 'Basket Items Summary Component',
          inputs: ['basket'],
        }),
        MockComponent({
          selector: 'ish-basket-address-summary',
          template: 'Basket Address Summary Component',
          inputs: ['basket'],
        }),
      ],
      imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), RouterTestingModule, FormsSharedModule, IconModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
    component.shippingMethods = [BasketMockData.getShippingMethod()];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render available shipping methods on page', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('div.radio')).toHaveLength(1);
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = { status: 404 } as HttpError;
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });

  it('should render an error if the user has currently no shipping method selected', () => {
    component.basket.commonShippingMethod = undefined;
    expect(() => fixture.detectChanges()).toThrow();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });

  it('should throw updateShippingMethod event when the user changes payment selection', done => {
    fixture.detectChanges();

    component.updateShippingMethod.subscribe(formValue => {
      expect(formValue).toBe('testShipping');
      done();
    });

    component.shippingForm.get('id').setValue('testShipping');
  });
});
