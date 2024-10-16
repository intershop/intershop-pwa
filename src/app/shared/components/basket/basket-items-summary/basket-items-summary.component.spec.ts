import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketItemsSummaryComponent } from './basket-items-summary.component';

describe('Basket Items Summary Component', () => {
  let component: BasketItemsSummaryComponent;
  let fixture: ComponentFixture<BasketItemsSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BasketItemsSummaryComponent,
        MockComponent(FaIconComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketItemsSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render basket product line items if basket items are there', () => {
    fixture.detectChanges();
    expect(element.querySelector('.cart-summary-checkout')).toBeTruthy();
  });

  it('should not show anything if there are no basket items', () => {
    component.basket.lineItems = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('.cart-summary-checkout')).toBeFalsy();
  });

  it('should not show showAll/HideAll links if there are less items than in collapsedItemsCount specified', () => {
    fixture.detectChanges();
    expect(element.querySelector('.fa-angle-right')).toBeFalsy();
    expect(element.querySelector('.fa-angle-up')).toBeFalsy();
  });

  it('should show showAll link if there are more items than in collapsedItemsCount specified', () => {
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    fixture.detectChanges();
    expect(element.querySelector('fa-icon[ng-reflect-icon="fas,angle-right"]')).toBeTruthy();
    expect(element.querySelector('fa-icon[ng-reflect-icon="fas,angle-up"]')).toBeFalsy();
  });

  it('should show hideAll link if there are more items than in collapsedItemsCount specified and items are expanded', () => {
    component.isCollapsed = false;
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    fixture.detectChanges();
    expect(element.querySelector('fa-icon[ng-reflect-icon="fas,angle-right"]')).toBeFalsy();
    expect(element.querySelector('fa-icon[ng-reflect-icon="fas,angle-up"]')).toBeTruthy();
  });
});
