import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements, findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyCustomerAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-customer-address-form/formly-customer-address-form.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { BasketShippingAddressWidgetComponent } from './basket-shipping-address-widget.component';

describe('Basket Shipping Address Widget Component', () => {
  let component: BasketShippingAddressWidgetComponent;
  let fixture: ComponentFixture<BasketShippingAddressWidgetComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    accountFacade = mock(AccountFacade);

    when(checkoutFacade.basket$).thenReturn(EMPTY);
    when(checkoutFacade.basketShippingAddress$).thenReturn(EMPTY);
    when(checkoutFacade.basketInvoiceAndShippingAddressEqual$).thenReturn(of(false));

    when(accountFacade.isLoggedIn$).thenReturn(of(true));
    when(accountFacade.addresses$()).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        BasketShippingAddressWidgetComponent,
        MockComponent(AddressComponent),
        MockComponent(FaIconComponent),
        MockComponent(FormlyCustomerAddressFormComponent),
        MockComponent(ModalDialogComponent),
        MockDirective(NgbCollapse),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketShippingAddressWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render create link if shipping is not set', () => {
    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "create-shipping-address-link",
        "shipping-address-form",
      ]
    `);
  });

  it('should not render create link if an anonymous user has different sinvoice and shipping address', () => {
    when(accountFacade.isLoggedIn$).thenReturn(of(false));

    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "shipping-address-form",
      ]
    `);
  });

  describe('with shipping address on basket', () => {
    beforeEach(() => {
      const address = BasketMockData.getAddress();
      when(checkoutFacade.basketShippingAddress$).thenReturn(of(address));
      when(accountFacade.addresses$()).thenReturn(of([address, { ...address, id: 'test' }]));
    });

    it('should render if shipping is set', () => {
      fixture.detectChanges();
      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "fa-icon",
          "ish-modal-dialog",
          "ish-address",
          "formly-form",
          "formly-field",
          "formly-group",
          "formly-field",
          "ng-component",
          "ish-formly-customer-address-form",
        ]
      `);
      expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
        Array [
          "edit-shipping-address-link",
          "create-shipping-address-link",
          "shipping-address-form",
        ]
      `);
    });

    it('should expand form if shipping is edited', () => {
      fixture.detectChanges();
      (element.querySelector('a[data-testing-id="edit-shipping-address-link"') as HTMLLinkElement).click();
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-modal-dialog",
          "ish-address",
          "formly-form",
          "formly-field",
          "formly-group",
          "formly-field",
          "ng-component",
          "ish-formly-customer-address-form",
        ]
      `);
      expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
        Array [
          "shipping-address-form",
        ]
      `);

      const form = fixture.debugElement.query(By.css('ish-formly-customer-address-form'))
        .componentInstance as FormlyCustomerAddressFormComponent;
      expect(form.address).toBeTruthy();
    });

    describe('with same invoice address', () => {
      beforeEach(() => {
        when(checkoutFacade.basketInvoiceAndShippingAddressEqual$).thenReturn(of(true));
      });

      it('should render if shipping is set', () => {
        fixture.detectChanges();

        expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
          Array [
            "formly-form",
            "formly-field",
            "formly-group",
            "formly-field",
            "ng-component",
            "ish-formly-customer-address-form",
          ]
        `);
        expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
          Array [
            "sameAsInvoice",
            "create-shipping-address-link",
            "shipping-address-form",
          ]
        `);
      });

      it('should expand form if shipping is created', () => {
        fixture.detectChanges();
        (element.querySelector('[data-testing-id="create-shipping-address-link"') as HTMLLinkElement).click();
        fixture.detectChanges();

        expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
          Array [
            "formly-form",
            "formly-field",
            "formly-group",
            "formly-field",
            "ng-component",
            "ish-formly-customer-address-form",
          ]
        `);
        expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
          Array [
            "sameAsInvoice",
            "shipping-address-form",
          ]
        `);

        const form = fixture.debugElement.query(By.css('ish-formly-customer-address-form'))
          .componentInstance as FormlyCustomerAddressFormComponent;
        expect(form.address).toBeEmpty();
      });
    });
  });

  describe('address selection', () => {
    const address = BasketMockData.getAddress();
    const addresses = [
      { ...address, id: '1', shipToAddress: false },
      { ...address, id: '2', shipToAddress: true },
      { ...address, id: '3', shipToAddress: true },
      { ...address, id: '4', shipToAddress: true },
    ];

    beforeEach(() => {
      when(checkoutFacade.basketShippingAddress$).thenReturn(of(addresses[1]));
      when(accountFacade.addresses$()).thenReturn(of(addresses));
    });

    it('should only use valid addresses for selection display', done => {
      fixture.detectChanges();

      component.addresses$.subscribe(addrs => {
        expect(addrs.map(add => add.id)).toMatchInlineSnapshot(`
                Array [
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

      verify(checkoutFacade.assignBasketAddress(anything(), 'shipping')).once();
    });
  });
});
