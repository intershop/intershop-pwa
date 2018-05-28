import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
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
          inputs: ['basket'],
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
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
    component.user = { firstName: 'Patricia' } as User;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render invoiceToAddress and ShipToAddress sections if user is set', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=invoiceToAddress]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=shipToAddress]')).toBeTruthy();
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
});
