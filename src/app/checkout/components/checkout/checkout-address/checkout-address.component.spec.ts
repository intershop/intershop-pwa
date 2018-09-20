import { SimpleChange, SimpleChanges } from '@angular/core';
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
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressComponent,
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
          selector: 'ish-checkout-address-form',
          template: 'Address Component',
          inputs: ['countries', 'regions', 'titles', 'resetForm'],
        }),
        MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component', inputs: ['options'] }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule, NgbModule, IconModule],
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

  it('should not render address forms after creation', () => {
    fixture.detectChanges();
    expect(
      element.querySelector('div.show[data-testing-id=create-invoice-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(
      element.querySelector('div.show[data-testing-id=create-shipping-address-form] ish-checkout-address-form')
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
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.invoiceAddresses).toHaveLength(2);
    expect(component.invoiceAddresses[0].id).toEqual('4712');
    expect(component.invoiceAddresses[1].id).toEqual('4714');
  });

  /* addresses can be selected as shipping address if they are not set as shippingAddress at the basket and if the address is a shipping address */
  it('should determine shipping addresses for the select box', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.shippingAddresses).toHaveLength(2);
    expect(component.shippingAddresses[0].id).toEqual('4712');
    expect(component.shippingAddresses[1].id).toEqual('4713');
  });

  it('should throw updateInvoiceAddress event when invoice address form value id changes', done => {
    fixture.detectChanges();

    component.updateInvoiceAddress.subscribe(formValue => {
      expect(formValue).toBe('testId');
      done();
    });

    component.invoiceAddressForm.get('id').setValue('testId');
  });

  it('should throw updateshippingAddress event when shipping address form value id changes', done => {
    fixture.detectChanges();

    component.updateShippingAddress.subscribe(x => {
      expect(x).toBe('testId');
      done();
    });

    component.shippingAddressForm.get('id').setValue('testId');
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
    expect(component.isInvoiceAddressFormCollapsed).toBeFalse();
    expect(component.isShippingAddressFormCollapsed).toBeTrue();
    expect(
      element.querySelector('div.show[data-testing-id=create-invoice-address-form] ish-checkout-address-form')
    ).toBeTruthy();
    expect(
      element.querySelector('div.show[data-testing-id=create-shipping-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-invoice-address-link]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-shipping-address-link]')).toBeTruthy();
  });

  it('should render shipping address form if showShippingAddressForm is called', () => {
    component.showShippingAddressForm();
    fixture.detectChanges();
    expect(component.isInvoiceAddressFormCollapsed).toBeTrue();
    expect(component.isShippingAddressFormCollapsed).toBeFalse();
    expect(
      element.querySelector('div.show[data-testing-id=create-shipping-address-form] ish-checkout-address-form')
    ).toBeTruthy();
    expect(
      element.querySelector('div.show[data-testing-id=create-invoice-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=create-invoice-address-link]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=create-shipping-address-link]')).toBeFalsy();
  });

  it('should set isShippingAddressDeleteable to true if the user has no preferred addresses', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.ngOnChanges(changes);
    expect(component.isShippingAddressDeleteable).toBeTrue();
  });

  it('should set isShippingAddressDeleteable to false if the user has a preferred invoice address', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.currentUser.preferredInvoiceToAddress = BasketMockData.getAddress();
    component.ngOnChanges(changes);
    expect(component.isShippingAddressDeleteable).toBeFalse();
  });

  it('should set isShippingAddressDeleteable to false if the user has a preferred shipping address', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.currentUser.preferredShipToAddress = BasketMockData.getAddress();
    component.ngOnChanges(changes);
    expect(component.isShippingAddressDeleteable).toBeFalse();
  });

  it('should throw createInvoiceAddress event when createCustomerInvoiceAddress is triggered', () => {
    const emitter = spy(component.createInvoiceAddress);

    component.createCustomerInvoiceAddress(BasketMockData.getAddress());

    verify(emitter.emit(anything())).once();
  });

  it('should throw createShippingAddress event when createCustomerShippingAddress is triggered', () => {
    const emitter = spy(component.createShippingAddress);

    component.createCustomerShippingAddress(BasketMockData.getAddress());

    verify(emitter.emit(anything())).once();
  });

  it('should throw deleteShippingAddress event when deleteAddress is triggered', () => {
    const emitter = spy(component.deleteShippingAddress);

    component.deleteAddress(BasketMockData.getAddress());

    verify(emitter.emit(anything())).once();
  });

  it('should collape invoice address form when cancelCreateCustomerInvoiceAddress is triggered', () => {
    component.isInvoiceAddressFormCollapsed = false;

    component.cancelCreateCustomerInvoiceAddress();
    expect(component.isInvoiceAddressFormCollapsed).toBeTrue();
  });

  it('should collape shipping address form when cancelCreateCustomerShippingAddress is triggered', () => {
    component.isShippingAddressFormCollapsed = false;

    component.cancelCreateCustomerShippingAddress();
    expect(component.isShippingAddressFormCollapsed).toBeTrue();
  });

  it('should throw countryChange event when handleCountryChange is triggered', () => {
    const emitter = spy(component.countryChange);

    component.handleCountryChange('DE');

    verify(emitter.emit(anything())).once();
  });
});
