import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { Wishlist } from '../../models/wishlist/wishlist.model';

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
    when(wishlistFacadeMock.wishlists$).thenReturn(EMPTY);
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(ProductsListComponent), WishlistWidgetComponent],
      imports: [TranslatePipe],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        provideTranslateService(),
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

  it('should display product list if there are wishlist products', () => {
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of(['sku1', 'sku2']));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=wishlistProductsList]')).toBeTruthy();
  });

  it('should not display product list if there are no wishlist products', () => {
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of([]));
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=wishlistProductsList]')).toBeFalsy();
  });

  describe('tileConfiguration', () => {
    it('should disable addToWishlist, addToOrderTemplate, addToCompare and addToQuote', () => {
      fixture.detectChanges();
      expect(component.tileConfiguration).toEqual({
        addToWishlist: false,
        addToOrderTemplate: false,
        addToCompare: false,
        addToQuote: false,
      });
    });
  });

  describe('wishlistSelectionStrategy', () => {
    // Wishlists with itemsCount set to trigger loadWishlistDetails (condition: itemsCount !== items?.length)
    const wl1: Wishlist = { id: 'wl1', title: 'Wishlist 1', preferred: false, creationDate: 100, itemsCount: 2 };
    const wl2: Wishlist = { id: 'wl2', title: 'Wishlist 2', preferred: true, creationDate: 200, itemsCount: 3 };
    const wl3: Wishlist = { id: 'wl3', title: 'Wishlist 3', preferred: false, creationDate: 300, itemsCount: 1 };

    let wishlists$: BehaviorSubject<Wishlist[]>;

    beforeEach(() => {
      wishlists$ = new BehaviorSubject<Wishlist[]>([wl1, wl2, wl3]);
      when(wishlistFacadeMock.wishlists$).thenReturn(wishlists$.asObservable());
      when(shoppingFacade.excludeFailedProducts$(anything())).thenCall(obs$ => obs$);
    });

    describe('strategy "all"', () => {
      it('should load details for all wishlists', () => {
        component.wishlistSelectionStrategy = 'all';
        fixture.detectChanges();
        verify(wishlistFacadeMock.loadWishlistDetails(deepEqual(['wl1', 'wl2', 'wl3']))).once();
      });

      it('should emit SKUs from all wishlists', done => {
        const wlWithItems: Wishlist[] = [
          { ...wl1, items: [{ sku: 'sku1', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }] },
          { ...wl2, items: [{ sku: 'sku2', id: 'i2', creationDate: 2, desiredQuantity: { value: 1 } }] },
        ];
        wishlists$.next(wlWithItems);
        component.wishlistSelectionStrategy = 'all';
        fixture.detectChanges();
        component.allWishlistsItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku1', 'sku2']);
          done();
        });
      });
    });

    describe('strategy "preferred"', () => {
      it('should load details only for the preferred wishlist', () => {
        component.wishlistSelectionStrategy = 'preferred';
        fixture.detectChanges();
        verify(wishlistFacadeMock.loadWishlistDetails(deepEqual(['wl2']))).once();
      });

      it('should not call loadWishlistDetails when items are already loaded', () => {
        wishlists$.next([
          {
            ...wl2,
            preferred: true,
            itemsCount: 1,
            items: [{ sku: 'sku1', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }],
          },
        ]);
        component.wishlistSelectionStrategy = 'preferred';
        fixture.detectChanges();
        verify(wishlistFacadeMock.loadWishlistDetails(anything())).never();
      });

      it('should emit SKUs from the preferred wishlist', done => {
        wishlists$.next([
          {
            ...wl2,
            preferred: true,
            itemsCount: 1,
            items: [{ sku: 'sku-preferred', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }],
          },
        ]);
        component.wishlistSelectionStrategy = 'preferred';
        fixture.detectChanges();
        component.allWishlistsItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku-preferred']);
          done();
        });
      });

      it('should fall back to latest wishlist when no preferred wishlist exists', done => {
        wishlists$.next([
          { ...wl1, items: [{ sku: 'sku-old', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }] },
          { ...wl3, items: [{ sku: 'sku-latest', id: 'i2', creationDate: 2, desiredQuantity: { value: 1 } }] },
        ]);
        component.wishlistSelectionStrategy = 'preferred';
        fixture.detectChanges();
        component.allWishlistsItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku-latest']);
          done();
        });
      });

      it('should load details for the latest wishlist when no preferred wishlist exists', () => {
        wishlists$.next([
          { ...wl1, preferred: false },
          { ...wl3, preferred: false },
        ]);
        component.wishlistSelectionStrategy = 'preferred';
        fixture.detectChanges();
        // wl3 has the highest creationDate (300)
        verify(wishlistFacadeMock.loadWishlistDetails(deepEqual(['wl3']))).once();
      });
    });

    describe('strategy "latest"', () => {
      it('should load details only for the latest wishlist', () => {
        component.wishlistSelectionStrategy = 'latest';
        fixture.detectChanges();
        // wl3 has the highest creationDate (300)
        verify(wishlistFacadeMock.loadWishlistDetails(deepEqual(['wl3']))).once();
      });

      it('should not call loadWishlistDetails when items are already loaded', () => {
        wishlists$.next([
          { ...wl3, itemsCount: 1, items: [{ sku: 'sku1', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }] },
        ]);
        component.wishlistSelectionStrategy = 'latest';
        fixture.detectChanges();
        verify(wishlistFacadeMock.loadWishlistDetails(anything())).never();
      });

      it('should emit SKUs from the latest wishlist', done => {
        wishlists$.next([
          { ...wl1, items: [{ sku: 'sku-old', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }] },
          { ...wl3, items: [{ sku: 'sku-latest', id: 'i2', creationDate: 2, desiredQuantity: { value: 1 } }] },
        ]);
        component.wishlistSelectionStrategy = 'latest';
        fixture.detectChanges();
        component.allWishlistsItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku-latest']);
          done();
        });
      });
    });

    describe('empty wishlists', () => {
      it('should not call loadWishlistDetails when wishlists list is empty', () => {
        wishlists$.next([]);
        fixture.detectChanges();
        verify(wishlistFacadeMock.loadWishlistDetails(anything())).never();
      });

      it('should not emit when wishlists list is empty', fakeAsync(() => {
        let emitted = false;
        wishlists$.next([]);
        fixture.detectChanges();
        component.allWishlistsItemsSkus$.subscribe(() => {
          emitted = true;
        });
        tick(100);
        expect(emitted).toBeFalse();
      }));
    });
  });
});
