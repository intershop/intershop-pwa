import { Component, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { IconModule } from '../../../../core/icon.module';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { Address } from '../../../../models/address/address.model';
import { HttpError } from '../../../../models/http-error/http-error.model';
import { User } from '../../../../models/user/user.model';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { CheckoutAddressComponent } from './checkout-address.component';

describe('Checkout Address Component', () => {
  let component: CheckoutAddressComponent;
  let fixture: ComponentFixture<CheckoutAddressComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressComponent,
        DummyComponent,
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
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
        MockComponent({
          selector: 'ish-customer-address-form',
          template: 'Customer Address Form Component',
          inputs: ['countries', 'regions', 'titles', 'address', 'resetForm'],
        }),
        MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component', inputs: ['options'] }),
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'checkout/shipping', component: DummyComponent }]),
        FormsSharedModule,
        NgbModule,
        IconModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
    component.addresses = [
      { id: 'ilMKAE8BlIUAAAFgEdAd1LZU', firstName: 'Patricia', invoiceToAddress: true, shipToAddress: true } as Address,
      { id: '4712', firstName: 'John', invoiceToAddress: true, shipToAddress: true } as Address,
      { id: '4713', firstName: 'Susan', invoiceToAddress: false, shipToAddress: true } as Address,
      { id: '4714', firstName: 'Dave', invoiceToAddress: true, shipToAddress: false } as Address,
    ];
    component.currentUser = { firstName: 'Patricia', lastName: 'Miller' } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render invoiceToAddress and ShipToAddress sections if set', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=invoiceToAddress]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=shipToAddress]')).toBeTruthy();
  });

  it('should render create address links after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=create-invoice-address-link]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=create-shipping-address-link]')).toBeTruthy();
  });

  it('should render one edit link if basket has the same invoice and shipTo address', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=edit-invoice-address-link]')).toBeTruthy();
    expect(element.querySelector('a[data-testing-id=edit-shipping-address-link]')).toBeFalsy();
  });

  it('should render one edit link the shipping address if basket has no invoice address', () => {
    component.basket.invoiceToAddress = undefined;
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=edit-invoice-address-link]')).toBeFalsy();
    expect(element.querySelector('a[data-testing-id=edit-shipping-address-link]')).toBeTruthy();
  });

  it('should not render address forms after creation', () => {
    fixture.detectChanges();
    expect(
      element.querySelector('div.show[data-testing-id=invoice-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(
      element.querySelector('div.show[data-testing-id=shipping-address-form] ish-checkout-address-form')
    ).toBeFalsy();
  });

  it('should render cart summary components after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-items-summary')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
  });

  it('should render invoiceToAddressBox if invoiceToAddress is set', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=invoiceToAddress] .address-box')).toBeTruthy();
  });

  it('should render shipToAddressBox if invoiceToAddress is set', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=shipToAddress] .address-box')).toBeTruthy();
  });

  it('should render sameAsInvoiceAddress text if shipTo and invoiceTo address are identical', () => {
    fixture.detectChanges();
    expect(element.querySelector('p[data-testing-id=sameAsInvoice]')).toBeTruthy();
  });

  /* addresses can be selected as invoice address if they are not set as invoiceAddress at the basket and if the address is a invoice address */
  it('should determine invoice addresses for the select box', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    fixture.detectChanges();
    component.ngOnChanges(changes);
    expect(component.invoice.addresses).toHaveLength(2);
    expect(component.invoice.addresses[0].id).toEqual('4712');
    expect(component.invoice.addresses[1].id).toEqual('4714');
  });

  /* addresses can be selected as shipping address if they are not set as shippingAddress at the basket and if the address is a shipping address */
  it('should determine shipping addresses for the select box', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.shipping.addresses).toHaveLength(2);
    expect(component.shipping.addresses[0].id).toEqual('4712');
    expect(component.shipping.addresses[1].id).toEqual('4713');
  });

  it('should throw updateInvoiceAddress event when invoice address form value id changes', done => {
    fixture.detectChanges();

    component.updateInvoiceAddress.subscribe(formValue => {
      expect(formValue).toBe('testId');
      done();
    });

    component.invoice.form.get('id').setValue('testId');
  });

  it('should throw updateshippingAddress event when shipping address form value id changes', done => {
    fixture.detectChanges();

    component.updateShippingAddress.subscribe(x => {
      expect(x).toBe('testId');
      done();
    });

    component.shipping.form.get('id').setValue('testId');
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

  it('should render invoice address form if showInvoiceAddressForm is called', () => {
    component.showInvoiceAddressForm();
    fixture.detectChanges();

    expect(component.invoice.isFormCollapsed).toBeFalse();
    expect(component.shipping.isFormCollapsed).toBeTrue();
    expect(
      element.querySelector('div.show[data-testing-id=invoice-address-form] ish-customer-address-form')
    ).toBeTruthy();
    expect(
      element.querySelector('div.show[data-testing-id=shipping-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-invoice-address-link]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-shipping-address-link]')).toBeTruthy();
  });

  it('should render shipping address form if showShippingAddressForm is called', () => {
    component.showShippingAddressForm();
    fixture.detectChanges();

    expect(component.invoice.isFormCollapsed).toBeTrue();
    expect(component.shipping.isFormCollapsed).toBeFalse();
    expect(
      element.querySelector('div.show[data-testing-id=shipping-address-form] ish-customer-address-form')
    ).toBeTruthy();
    expect(
      element.querySelector('div.show[data-testing-id=invoice-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-invoice-address-link]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=create-shipping-address-link]')).toBeFalsy();
  });

  it('should set isShippingAddressDeleteable to true if the user has no preferred addresses', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.ngOnChanges(changes);
    expect(component.shipping.isAddressDeleteable).toBeTrue();
  });

  it('should set isShippingAddressDeleteable to false if the user has a preferred invoice address', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.currentUser.preferredInvoiceToAddress = BasketMockData.getAddress();
    component.ngOnChanges(changes);
    expect(component.shipping.isAddressDeleteable).toBeFalse();
  });

  it('should set isShippingAddressDeleteable to false if the user has a preferred shipping address', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.currentUser.preferredShipToAddress = BasketMockData.getAddress();
    component.ngOnChanges(changes);
    expect(component.shipping.isAddressDeleteable).toBeFalse();
  });

  it('should throw createInvoiceAddress event when saveCustomerInvoiceAddress is triggered and invoice.address is undefined', done => {
    fixture.detectChanges();

    component.createInvoiceAddress.subscribe(address => {
      expect(address.id).toBe(BasketMockData.getAddress().id);
      done();
    });

    component.saveCustomerInvoiceAddress(BasketMockData.getAddress());
  });

  it('should throw updateInvoiceAddress event when saveCustomerInvoiceAddress is triggered and invoice.address is defined', done => {
    fixture.detectChanges();
    component.invoice.address = component.basket.invoiceToAddress;

    component.updateCustomerAddress.subscribe(address => {
      expect(address.id).toBe(BasketMockData.getAddress().id);
      done();
    });

    component.saveCustomerInvoiceAddress(BasketMockData.getAddress());
  });

  it('should throw createShippingAddress event when saveCustomerShippingAddress is triggered and shipping.address is undefined', done => {
    fixture.detectChanges();

    component.createShippingAddress.subscribe(address => {
      expect(address.id).toBe(BasketMockData.getAddress().id);
      done();
    });

    component.saveCustomerShippingAddress(BasketMockData.getAddress());
  });

  it('should throw updateShippingAddress event when saveCustomerShippingAddress is triggered and shipping.address is defined', done => {
    fixture.detectChanges();
    component.shipping.address = component.basket.commonShipToAddress;

    component.updateCustomerAddress.subscribe(address => {
      expect(address.id).toBe(BasketMockData.getAddress().id);
      done();
    });

    component.saveCustomerShippingAddress(BasketMockData.getAddress());
  });

  it('should throw deleteShippingAddress event when deleteAddress is triggered', () => {
    const emitter = spy(component.deleteShippingAddress);

    component.deleteAddress(BasketMockData.getAddress());

    verify(emitter.emit(anything())).once();
  });

  it('should collape invoice address form when cancelEditAddress for an invoice address is triggered', () => {
    component.invoice.isFormCollapsed = false;

    component.cancelEditAddress(component.invoice);
    expect(component.invoice.isFormCollapsed).toBeTrue();
  });

  it('should collapse shipping address form when cancelEditAddress for a shipping address is triggered', () => {
    component.shipping.isFormCollapsed = false;

    component.cancelEditAddress(component.shipping);
    expect(component.shipping.isFormCollapsed).toBeTrue();
  });

  it('should throw countryChange event when handleCountryChange is triggered', () => {
    const emitter = spy(component.countryChange);

    component.handleCountryChange('DE');

    verify(emitter.emit(anything())).once();
  });

  it('should not render an error if the user has currently no addresses selected', () => {
    component.basket.invoiceToAddress = undefined;
    component.basket.commonShipToAddress = undefined;
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeFalsy();
  });

  it('should render an error if the user clicks next and has currently no addresses selected', () => {
    component.basket.invoiceToAddress = undefined;
    component.basket.commonShipToAddress = undefined;
    component.nextStep();
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });

  it('should set submitted if next button is clicked', () => {
    expect(component.submitted).toBeFalse();
    component.nextStep();
    expect(component.submitted).toBeTrue();
  });

  it('should not disable next button if basket addresses are set and next button is clicked', () => {
    expect(component.nextDisabled).toBeFalse();
    component.nextStep();
    expect(component.nextDisabled).toBeFalse();
  });

  it('should disable next button if basket invoice is missing and next button is clicked', () => {
    component.basket.invoiceToAddress = undefined;

    component.nextStep();
    expect(component.nextDisabled).toBeTrue();
  });

  it('should disable next button if basket shipping is missing and next button is clicked', () => {
    component.basket.commonShipToAddress = undefined;

    component.nextStep();
    expect(component.nextDisabled).toBeTrue();
  });
});
