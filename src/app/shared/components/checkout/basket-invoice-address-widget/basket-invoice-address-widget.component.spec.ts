import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements, findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { FormlyCustomerAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-customer-address-form/formly-customer-address-form.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { AddressDoctorComponent } from '../../../../extensions/address-doctor/shared/address-doctor/address-doctor.component';

import { BasketInvoiceAddressWidgetComponent } from './basket-invoice-address-widget.component';

describe('Basket Invoice Address Widget Component', () => {
  let component: BasketInvoiceAddressWidgetComponent;
  let fixture: ComponentFixture<BasketInvoiceAddressWidgetComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(EMPTY);
    when(checkoutFacade.basketInvoiceAddress$).thenReturn(EMPTY);

    accountFacade = mock(AccountFacade);
    when(accountFacade.isLoggedIn$).thenReturn(of(true));

    await TestBed.configureTestingModule({
      imports: [BasketInvoiceAddressWidgetComponent, FormlyTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: FeatureToggleService, useValue: { enabled: (feature: string) => feature === 'addressDoctor' } },
      ],
    })
      .overrideComponent(BasketInvoiceAddressWidgetComponent, {
        set: {
          imports: [
            AsyncPipe,
            TranslatePipe,
            MockComponent(AddressDoctorComponent),
            FormlyForm,
            NgbCollapseModule,
            ReactiveFormsModule,
            MockComponent(FormlyCustomerAddressFormComponent),
            MockComponent(AddressComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketInvoiceAddressWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render create link if invoice is not set', () => {
    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "create-invoice-address-link",
        "invoice-address-form",
      ]
    `);
  });

  describe('with address on basket', () => {
    beforeEach(() => {
      when(checkoutFacade.basketInvoiceAddress$).thenReturn(of(BasketMockData.getAddress()));
    });

    it('should render if invoice is set', () => {
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-address",
          "ish-formly-customer-address-form",
        ]
      `);
      expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
        [
          "edit-invoice-address-link",
          "create-invoice-address-link",
          "invoice-address-form",
        ]
      `);
    });

    it('should expand form if invoice is edited', () => {
      fixture.detectChanges();
      (element.querySelector('button[data-testing-id="edit-invoice-address-link"') as HTMLLinkElement).click();
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-address",
          "ish-formly-customer-address-form",
        ]
      `);
      expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
        [
          "invoice-address-form",
        ]
      `);

      const form = fixture.debugElement.query(By.css('ish-formly-customer-address-form'))
        .componentInstance as FormlyCustomerAddressFormComponent;
      expect(form.address).toBeTruthy();
    });

    it('should expand form if invoice is created', () => {
      fixture.detectChanges();
      (element.querySelector('[data-testing-id="create-invoice-address-link"') as HTMLLinkElement).click();
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-address",
          "ish-formly-customer-address-form",
        ]
      `);
      expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
        [
          "invoice-address-form",
        ]
      `);

      const form = fixture.debugElement.query(By.css('ish-formly-customer-address-form'))
        .componentInstance as FormlyCustomerAddressFormComponent;
      expect(form.address).toBeEmpty();
    });
  });

  describe('address selection', () => {
    const address = BasketMockData.getAddress();
    const addresses = [
      { ...address, id: '1', invoiceToAddress: false },
      { ...address, id: '2', invoiceToAddress: true },
      { ...address, id: '3', invoiceToAddress: true },
      { ...address, id: '4', invoiceToAddress: true },
    ];

    beforeEach(() => {
      when(checkoutFacade.basketInvoiceAddress$).thenReturn(of(addresses[1]));
      component.eligibleAddresses$ = of(addresses);
    });

    it('should only use valid addresses for selection display', done => {
      fixture.detectChanges();

      component.addresses$.subscribe(addrs => {
        expect(addrs.map(add => add.id)).toMatchInlineSnapshot(`
                [
                  "3",
                  "4",
                ]
            `);
        done();
      });
    });

    it('should update address after selecting', () => {
      fixture.detectChanges();
      component.form.setValue({ id: addresses[0].id });

      verify(checkoutFacade.assignBasketAddress(anything(), 'invoice')).once();
    });
  });
});
