import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Address } from 'ish-core/models/address/address.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyCustomerAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-customer-address-form/formly-customer-address-form.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AccountAddressesComponent } from './account-addresses.component';

const mockAddresses = [
  {
    id: '0001"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1001',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Potsdamer Str. 20',
    postalCode: '14483',
    city: 'Berlin',
  },
  {
    id: '0002"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1002',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Berliner Str. 20',
    postalCode: '14482',
    city: 'Berlin',
  },
  {
    id: '0003"',
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1003',
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
    urn: 'urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:1004',
    title: 'Ms.',
    firstName: 'Patricia',
    lastName: 'Miller',
    addressLine1: 'Intershop Tower',
    postalCode: '07743',
    city: 'Jena',
    companyName1: 'Intershop Communications AG',
  },
] as Address[];

const patriciaInfo = {
  firstName: 'Patricia',
  lastName: 'Miller',
  email: 'patricia@test.intershop.de',
};

describe('Account Addresses Component', () => {
  let component: AccountAddressesComponent;
  let fixture: ComponentFixture<AccountAddressesComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      declarations: [
        AccountAddressesComponent,
        MockComponent(AddressComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(FormlyCustomerAddressFormComponent),
        MockComponent(ModalDialogComponent),
      ],
      imports: [FormlyTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    })
      .overrideComponent(AccountAddressesComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAddressesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(accountFacade.addresses$()).thenReturn(of(mockAddresses));

    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: mockAddresses[0].urn,
      })
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display only one preferred address if preferred invoice and shipping address are equal', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: mockAddresses[0].urn,
        preferredShipToAddressUrn: mockAddresses[0].urn,
      })
    );

    fixture.detectChanges();

    expect(component.preferredAddressesEqual).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeTruthy();
    expect(
      element.querySelectorAll('div[data-testing-id=preferred-invoice-and-shipping-address] formly-group formly-field')
    ).toHaveLength(2);
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeFalsy();
  });

  it('should display both preferred addresses if preferred invoice and shipping address are not equal', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: mockAddresses[0].urn,
        preferredShipToAddressUrn: mockAddresses[1].urn,
      })
    );

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeTruthy();
    expect(
      element.querySelectorAll('div[data-testing-id=preferred-invoice-address] formly-group formly-field')
    ).toHaveLength(1);
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeTruthy();
    expect(
      element.querySelectorAll('div[data-testing-id=preferred-shipping-address] formly-group formly-field')
    ).toHaveLength(1);
  });

  it('should not display further addresses if only preferred invoice and shipping addresses are available', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: mockAddresses[0].urn,
        preferredShipToAddressUrn: mockAddresses[1].urn,
      })
    );
    when(accountFacade.addresses$()).thenReturn(of([mockAddresses[0], mockAddresses[1]]));

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeFalsy();
  });

  it('should display the proper headlines and info texts if no preferred addresses are available', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: undefined,
        preferredShipToAddressUrn: undefined,
      })
    );

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address] p.no-address-info')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address] p.no-address-info')).toBeTruthy();
  });

  it('should not filter further addresses if no preferred addresses are available', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: undefined,
        preferredShipToAddressUrn: undefined,
      })
    );

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(4);
  });

  it('should reduce further addresses by two if both preferred addresses are available', () => {
    when(accountFacade.user$).thenReturn(
      of({
        ...patriciaInfo,
        preferredInvoiceToAddressUrn: mockAddresses[0].urn,
        preferredShipToAddressUrn: mockAddresses[1].urn,
      })
    );

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(2);
  });

  it('should reduce further addresses by one if only one preferred address is available', () => {
    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeTruthy();
    expect(element.querySelectorAll('div[data-testing-id=further-addresses] .list-item-row')).toHaveLength(3);
  });

  it('should not display any address if user has no saved addresses', () => {
    when(accountFacade.addresses$()).thenReturn(of([]));

    fixture.detectChanges();

    expect(element.querySelector('div[data-testing-id=preferred-invoice-and-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-invoice-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=preferred-shipping-address]')).toBeFalsy();
    expect(element.querySelector('div[data-testing-id=further-addresses]')).toBeFalsy();
    expect(element.querySelector('p.empty-list')).toBeTruthy();
  });

  it('should not show no addresses info if there are addresses available', () => {
    fixture.detectChanges();

    expect(element.querySelector('p.empty-list')).toBeFalsy();
  });

  it('should render create address button after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=create-address-button]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=create-address-form]')).toBeFalsy();
  });

  it('should render create address form if showCreateAddressForm is called', async () => {
    fixture.detectChanges();
    component.showCreateAddressForm();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.isCreateAddressFormCollapsed).toBeFalse();
    expect(element.querySelector('[data-testing-id=create-address-form]')).toBeTruthy();
    expect(element.querySelector('a[data-testing-id=create-address-button]')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = makeHttpError({ status: 404 });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should emit createCustomerAddress event when createCustomerAddress is triggered', () => {
    const address = { urn: '123' } as Address;

    component.createAddress(address);

    verify(accountFacade.createCustomerAddress(anything())).once();
  });

  it('should emit updateAddress event when updateAddress is triggered', () => {
    const address = { id: '123' } as Address;

    component.updateAddress(address);

    verify(accountFacade.updateCustomerAddress(anything())).once();
  });

  it('should emit deleteCustomerAddress event when deleteCustomerAddress is triggered', () => {
    const address = { id: '123' } as Address;

    component.deleteAddress(address);

    verify(accountFacade.deleteCustomerAddress(anything())).once();
  });
});
