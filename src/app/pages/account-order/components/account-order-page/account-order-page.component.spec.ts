import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from 'ish-shared/address/components/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/basket/components/basket-cost-summary/basket-cost-summary.component';
import { LineItemListComponent } from 'ish-shared/basket/components/line-item-list/line-item-list.component';
import { InfoBoxComponent } from 'ish-shared/common/components/info-box/info-box.component';

import { AccountOrderPageComponent } from './account-order-page.component';

describe('Account Order Page Component', () => {
  let component: AccountOrderPageComponent;
  let fixture: ComponentFixture<AccountOrderPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderPageComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
      ],
      imports: [IconModule, PipesModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if no order is available', () => {
    component.order = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-summary-info]')).toBeTruthy();
    expect(element.querySelectorAll('ish-info-box')).toHaveLength(4);
    expect(element.querySelector('ish-line-item-list')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the order list link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="orders-link"]')).toBeTruthy();
  });
});
