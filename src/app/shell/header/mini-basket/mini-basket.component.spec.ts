import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
      imports: [NgbDropdownModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
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
      'shopping_cart.ministatus.items.text': '{{0}} items',
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

  it('should toggle dropdown menu when clicked', () => {
    const toggleButton = fixture.debugElement.query(By.css('button[ngbDropdownToggle]')).nativeElement;
    toggleButton.click();
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(By.css('div[ngbDropdownMenu]'));
    // menu should be present
    expect(dropdownMenu).toBeTruthy();

    // check if menu is shown
    expect(dropdownMenu.nativeElement.classList).toContain('show');

    // click again to close
    toggleButton.click();
    fixture.detectChanges();

    // menu should be hidden
    expect(dropdownMenu.nativeElement.classList).not.toContain('show');
  });
});
