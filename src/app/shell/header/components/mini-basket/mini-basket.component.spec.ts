import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PipesModule } from 'ish-core/pipes.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductImageComponent } from 'ish-shell/header/components/product-image/product-image.component';

import { MiniBasketComponent } from './mini-basket.component';

describe('Mini Basket Component', () => {
  let fixture: ComponentFixture<MiniBasketComponent>;
  let component: MiniBasketComponent;
  let element: HTMLElement;
  let lineItem: LineItemView;
  let basket: BasketView;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MiniBasketComponent,
        MockComponent(FaIconComponent),
        MockComponent(NgbCollapse),
        MockComponent(ProductImageComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', { 'shopping_cart.ministatus.items.text': { other: '#' } });
    lineItem = BasketMockData.getBasketItem();
    basket = {
      id: '4711',
      lineItems: [lineItem, lineItem, lineItem],
      purchaseCurrency: 'USD',
      totals: BasketMockData.getTotals(),
      totalProductQuantity: 30,
    };

    component.basket = basket;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product rows if loaded', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-row')).toHaveLength(3);
  });

  it('should hold propper product count if loaded', () => {
    const changes: SimpleChanges = {
      basket: new SimpleChange(undefined, basket, false),
    };
    component.ngOnChanges(changes);
    expect(component.itemCount).toBe(30);
  });

  it('should render product image component on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toHaveLength(3);
  });

  it('should set isCollapsed to propper value if toggleCollapsed is called', () => {
    component.isCollapsed = true;
    component.toggleCollapse();
    expect(component.isCollapsed).toBeFalsy();
    component.toggleCollapse();
    expect(component.isCollapsed).toBeTruthy();
  });

  it('should set isCollapsed to true if collapse() is called', () => {
    component.collapse();
    expect(component.isCollapsed).toBeTruthy();
  });

  it('should set isCollapsed to false if open() is called', () => {
    component.open();
    expect(component.isCollapsed).toBeFalsy();
  });
});
