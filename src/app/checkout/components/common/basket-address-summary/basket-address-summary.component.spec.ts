import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Address } from '../../../../models/address/address.model';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { BasketAddressSummaryComponent } from './basket-address-summary.component';

describe('Basket Address Summary Component', () => {
  let component: BasketAddressSummaryComponent;
  let fixture: ComponentFixture<BasketAddressSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketAddressSummaryComponent,
        MockComponent({
          selector: 'ish-address',
          template: 'Address Component',
          inputs: ['address'],
        }),
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

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
    expect(element.querySelector('div[data-testing-id=address-summary-invoice-to-address] ish-address')).toBeTruthy();
  });

  it('should render same as text if invoiceTo address equals commonShipTo address', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=address-summary-ship-to-address] address')).toBeTruthy();
  });

  it('should render commonShipToAddress if invoiceTo address does not equal commonShipTo address', () => {
    const address = { firstName: 'John' } as Address;
    component.basket.commonShipToAddress = address;
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=address-summary-ship-to-address] ish-address')).toBeTruthy();
  });
});
