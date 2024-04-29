import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { WishlistWidgetComponent } from './wishlist-widget.component';

describe('Wishlist Widget Component', () => {
  let component: WishlistWidgetComponent;
  let fixture: ComponentFixture<WishlistWidgetComponent>;
  let element: HTMLElement;

  let wishlistFacadeMock: WishlistsFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    wishlistFacadeMock = mock(WishlistsFacade);
    shoppingFacade = mock(ShoppingFacade);
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(EMPTY);
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(ProductsListComponent), WishlistWidgetComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display empty list text if there are no wishlist products', () => {
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(of());
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of());
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=emptyWishlistProductsList]')).toBeTruthy();
  });

  it('should display product list if there are wishlist products', () => {
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(of(['sku1', 'sku2']));
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of(['sku1', 'sku2']));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=wishlistProductsList]')).toBeTruthy();
  });
});
