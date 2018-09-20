import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Address } from '../../../models/address/address.model';
import { User } from '../../../models/user/user.model';
import { MockComponent } from '../../../utils/dev/mock.component';

import { AccountAddressesPageComponent } from './account-addresses-page.component';

describe('Account Addresses Page Component', () => {
  let component: AccountAddressesPageComponent;
  let fixture: ComponentFixture<AccountAddressesPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountAddressesPageComponent,
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAddressesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.addresses = [
      {
        id: '0001"',
        title: 'Ms.',
        firstName: 'Patricia',
        lastName: 'Miller',
        addressLine1: 'Potsdamer Str. 20',
        postalCode: '14483',
        city: 'Berlin',
      },
      {
        id: '0002"',
        title: 'Ms.',
        firstName: 'Patricia',
        lastName: 'Miller',
        addressLine1: 'Berliner Str. 20',
        postalCode: '14482',
        city: 'Berlin',
      },
      {
        id: '0003"',
        title: 'Ms.',
        firstName: 'Patricia',
        lastName: 'Miller',
        addressLine1: 'Neue Promenade 5',
        postalCode: '10178',
        city: 'Berlin',
        companyName1: 'Intershop Communications AG',
      },
      {
        id: '0004"',
        title: 'Ms.',
        firstName: 'Patricia',
        lastName: 'Miller',
        addressLine1: 'Intershop Tower',
        postalCode: '07743',
        city: 'Jena',
        companyName1: 'Intershop Communications AG',
      },
    ] as Address[];

    component.user = {
      type: 'SMBCustomerUser',
      firstName: 'Patricia',
      lastName: 'Miller',
      email: 'patricia@test.intershop.de',
    } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display only one preferred address if preferred invoice and shipping address are equal', () => {
    component.user.preferredInvoiceToAddress = component.addresses[0];
    component.user.preferredShipToAddress = component.addresses[0];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.preferredAddressesEqual).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeFalsy();
  });

  it('should display both preferred addresses if preferred invoice and shipping address are not equal', () => {
    component.user.preferredInvoiceToAddress = component.addresses[0];
    component.user.preferredShipToAddress = component.addresses[1];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeTruthy();
  });

  it('should not display further addresses if only preferred invoice and shipping addresses are available', () => {
    component.user.preferredInvoiceToAddress = component.addresses[0];
    component.user.preferredShipToAddress = component.addresses[1];
    component.addresses = [component.addresses[0], component.addresses[1]] as Address[];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeFalsy();
  });

  it('should display the proper headlines and info texts if no preferred addresses are available', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address] p.no-address-info')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address] p.no-address-info')).toBeTruthy();
  });

  it('should not filter further addresses if no preferred addresses are available', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(4);
  });

  it('should reduce further addresses by two if both preferred addresses are available', () => {
    component.user.preferredInvoiceToAddress = component.addresses[0];
    component.user.preferredShipToAddress = component.addresses[1];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(2);
  });

  it('should reduce further addresses by one if only one preferred address is available', () => {
    component.user.preferredInvoiceToAddress = component.addresses[0];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(3);
  });

  it('should not display any address if user has no saved addresses', () => {
    component.addresses = [] as Address[];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeFalsy();
    expect(element.querySelector('p.empty-list')).toBeTruthy();
  });

  it('should not show no addresses info if there are addresses available', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('p.empty-list')).toBeFalsy();
  });
});
