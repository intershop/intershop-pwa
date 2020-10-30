import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Address } from 'ish-core/models/address/address.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';

import { BasketAddressSummaryComponent } from './basket-address-summary.component';

describe('Basket Address Summary Component', () => {
  let component: BasketAddressSummaryComponent;
  let fixture: ComponentFixture<BasketAddressSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketAddressSummaryComponent, MockComponent(AddressComponent), MockComponent(FaIconComponent)],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketAddressSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render invoiceTo address for the basket', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=address-summary-invoice-to-address] ish-address')).toBeTruthy();
  });

  it('should render same as text if invoiceTo address equals commonShipTo address', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=address-summary-ship-to-address] address')).toBeTruthy();
  });

  it('should render commonShipToAddress if invoiceTo address does not equal commonShipTo address', () => {
    const address = { firstName: 'John' } as Address;
    component.basket.commonShipToAddress = address;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=address-summary-ship-to-address] ish-address')).toBeTruthy();
  });
});
