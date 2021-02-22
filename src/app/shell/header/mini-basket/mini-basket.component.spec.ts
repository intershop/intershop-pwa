import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { LazyMiniBasketContentComponent } from 'ish-shell/shared/lazy-mini-basket-content/lazy-mini-basket-content.component';

import { MiniBasketComponent } from './mini-basket.component';

describe('Mini Basket Component', () => {
  let component: MiniBasketComponent;
  let fixture: ComponentFixture<MiniBasketComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));
    const appFacade = mock(AppFacade);
    when(appFacade.routingInProgress$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        MiniBasketComponent,
        MockComponent(FaIconComponent),
        MockComponent(LazyMiniBasketContentComponent),
        PricePipe,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const translate = TestBed.inject(TranslateService);
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

  it('should display summary when collapsed', () => {
    fixture.detectChanges();
    expect(element.textContent.replace(/ /g, '')).toMatchInlineSnapshot(`"30items/$141,796.98"`);
  });

  it('should display right amounts, lineItems and totals when expanded', () => {
    component.open();
    fixture.detectChanges();
    expect(element.textContent.replace(/ /g, '')).toMatchInlineSnapshot(`"30items/$141,796.98"`);
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
