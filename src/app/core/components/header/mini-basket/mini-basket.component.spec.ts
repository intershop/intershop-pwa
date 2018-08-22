import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BasketItemView } from '../../../../models/basket-item/basket-item.model';
import { BasketView } from '../../../../models/basket/basket.model';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { IconModule } from '../../../icon.module';

import { MiniBasketComponent } from './mini-basket.component';

describe('Mini Basket Component', () => {
  let fixture: ComponentFixture<MiniBasketComponent>;
  let component: MiniBasketComponent;
  let element: HTMLElement;
  let lineItem: BasketItemView;
  let basket: BasketView;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NgbCollapseModule,
        CommonModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        PipesModule,
        IconModule,
      ],
      declarations: [
        MiniBasketComponent,
        MockComponent({ selector: 'ish-product-image', template: 'Product Image Component', inputs: ['product'] }),
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
    };

    component.basket = basket;
    component.currentProduct = 0;
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
    component.ngOnChanges();
    expect(component.itemCount).toBe(30);
  });

  it('should reset vertical scroll state if basket changes', () => {
    // TODO: mockito implementation?
    // tslint:disable-next-line:ban
    spyOn(component, 'animate');

    component.resetScroller();

    expect(component.currentProduct).toBe(0);
    expect(component.animate).toHaveBeenCalledWith(0);
  });

  it('should increment currentProduct index and disable scroll down button when clicking on scroll down button', () => {
    fixture.detectChanges();
    (element.getElementsByClassName('btn-scroll-down')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(1);
    expect(element.getElementsByClassName('btn-scroll-down')[0].getAttribute('class')).toContain('disabled');
  });

  it('should decrement currentProduct index and disable scroll up button when clicking on scroll up button', () => {
    fixture.detectChanges();

    (element.getElementsByClassName('btn-scroll-down')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(1);
    expect(element.getElementsByClassName('btn-scroll-up')[0].getAttribute('class')).not.toContain('disabled');

    (element.getElementsByClassName('btn-scroll-up')[0] as HTMLDivElement).click();
    fixture.detectChanges();
    expect(component.currentProduct).toEqual(0);
    expect(element.getElementsByClassName('btn-scroll-up')[0].getAttribute('class')).toContain('disabled');
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
