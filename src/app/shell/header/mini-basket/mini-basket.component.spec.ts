import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { MiniBasketComponent } from './mini-basket.component';

describe('Mini Basket Component', () => {
  let component: MiniBasketComponent;
  let fixture: ComponentFixture<MiniBasketComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async(() => {
    checkoutFacade = mock(CheckoutFacade);
    TestBed.configureTestingModule({
      declarations: [
        MiniBasketComponent,
        MockComponent(FaIconComponent),
        MockComponent(ProductImageComponent),
        MockPipe(ProductRoutePipe),
        PricePipe,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: CheckoutFacade,
          useFactory: () => instance(checkoutFacade),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', {
      'shopping_cart.ministatus.items.text': { other: '# items' },
      'shopping_cart.pli.qty.label': 'x',
      'shopping_cart.ministatus.view_cart.link': 'VIEW CART',
    });
    const lineItem = BasketMockData.getBasketItem();

    when(checkoutFacade.basketItemCount$).thenReturn(of(lineItem.quantity.value * 3));
    when(checkoutFacade.basketItemTotal$).thenReturn(of(BasketMockData.getTotals().itemTotal));
    when(checkoutFacade.basketLineItems$).thenReturn(of([lineItem, lineItem, lineItem]));
    when(checkoutFacade.basketError$).thenReturn(EMPTY);
    when(checkoutFacade.basketChange$).thenReturn(EMPTY);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render product rows if collapsed', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-row')).toHaveLength(0);
  });

  it('should render product rows if expanded', () => {
    component.open();
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-row')).toHaveLength(3);
  });

  it('should display summary when collapsed', () => {
    fixture.detectChanges();
    expect(element.textContent.replace(/ /g, '')).toMatchInlineSnapshot(`"30items/$141,796.98"`);
  });

  it('should display right amounts, lineItems and totals when expanded', () => {
    component.open();
    fixture.detectChanges();
    expect(element.textContent.replace(/ /g, '')).toMatchInlineSnapshot(
      `"30items/$141,796.98pliname$3.00x10pliname$3.00x10pliname$3.00x10VIEWCART"`
    );
  });

  it('should render product image component on expanded component', () => {
    component.open();
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toHaveLength(3);
  });

  it('should set isCollapsed to proper value if toggleCollapsed is called', () => {
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
