import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../../../../core/icon.module';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { BasketItemsSummaryComponent } from './basket-items-summary.component';

describe('Basket Items Summary Component', () => {
  let component: BasketItemsSummaryComponent;
  let fixture: ComponentFixture<BasketItemsSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasketItemsSummaryComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, PipesModule, IconModule],
    }).compileComponents();
  }));

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
    expect(element.querySelector('.row')).toBeTruthy();
    expect(element.querySelector('.row').innerHTML).toContain('pli name');
  });

  it('should not show anything if there are no basket items', () => {
    component.basket.lineItems = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('.row')).toBeFalsy();
  });

  it('should not show showAll/HideAll links if there are less items than in collapsedItemsCount specified', () => {
    fixture.detectChanges();
    expect(element.querySelector('.fa-angle-down')).toBeFalsy();
    expect(element.querySelector('.fa-angle-up')).toBeFalsy();
  });

  it('should show showAll link if there are more items than in collapsedItemsCount specified', () => {
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    fixture.detectChanges();
    expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,angle-down"]')).toBeTruthy();
    expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,angle-up"]')).toBeFalsy();
  });

  it('should show hideAll link if there are more items than in collapsedItemsCount specified and items are expanded', () => {
    component.isCollapsed = false;
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    component.basket.lineItems.push(BasketMockData.getBasketItem());
    fixture.detectChanges();
    expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,angle-down"]')).toBeFalsy();
    expect(element.querySelector('fa-icon[ng-reflect-icon-prop="fas,angle-up"]')).toBeTruthy();
  });
});
