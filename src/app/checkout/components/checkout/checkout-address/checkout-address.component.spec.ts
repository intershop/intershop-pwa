import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { Address } from '../../../../models/address/address.model';
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
          inputs: ['totals', 'isEstimated'],
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
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule, FormsSharedModule],
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
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.invoiceAddresses).toHaveLength(2);
    expect(component.invoiceAddresses[0].id).toEqual('4712');
    expect(component.invoiceAddresses[1].id).toEqual('4714');
  });

  /* addresses can be selected as shipping address if they are not set as shippingAddress at the basket and if the address is a shipping address */
  it('should determine shipping addresses for the select box', () => {
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.shippingAddresses).toHaveLength(2);
    expect(component.shippingAddresses[0].id).toEqual('4712');
    expect(component.shippingAddresses[1].id).toEqual('4713');
  });

  it('should throw updateInvoiceAddress event when invoice address form value id changes', done => {
    fixture.detectChanges();

    let formValue = '';
    component.updateInvoiceAddress.subscribe(x => {
      formValue = x;
      done();
    });

    component.invoiceAddressForm.get('id').setValue('testId');
    expect(formValue).toBe('testId');
  });

  it('should throw updateshippingAddress event when shipping address form value id changes', done => {
    fixture.detectChanges();

    component.updateShippingAddress.subscribe(x => {
      expect(x).toBe('testId');
      done();
    });

    component.shippingAddressForm.get('id').setValue('testId');
  });
});
