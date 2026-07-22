import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { uniq } from 'lodash-es';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { anything, instance, mock, verify, when } from 'ts-mockito';

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
    when(wishlistFacadeMock.preferredWishlist$).thenReturn(EMPTY);
    when(wishlistFacadeMock.wishlistItemsSkus$(anything())).thenReturn(EMPTY);
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

  describe('product selection', () => {
    const wl1: Wishlist = { id: 'wl1', title: 'Wishlist 1', preferred: false, itemsCount: 2 };
    const wl2: Wishlist = { id: 'wl2', title: 'Wishlist 2', preferred: true, itemsCount: 3 };
    const wl3: Wishlist = { id: 'wl3', title: 'Wishlist 3', preferred: false, itemsCount: 1 };

    let wishlists$: BehaviorSubject<Wishlist[]>;

    beforeEach(() => {
      wishlists$ = new BehaviorSubject<Wishlist[]>([wl1, wl2, wl3]);
      when(wishlistFacadeMock.preferredWishlist$).thenReturn(
        wishlists$.pipe(map(wishlists => wishlists.find(wishlist => wishlist.preferred)))
      );
      when(wishlistFacadeMock.wishlistItemsSkus$(anything())).thenCall((wishlistId?: string) =>
        wishlists$.pipe(
          map(wishlists => (wishlistId ? wishlists.filter(wishlist => wishlist.id === wishlistId) : wishlists)),
          map(wishlists => uniq(wishlists.map(wishlist => wishlist.items?.map(item => item.sku) ?? []).flat()))
        )
      );
      when(shoppingFacade.excludeFailedProducts$(anything())).thenCall(obs$ => obs$);
    });

    describe('with a preferred wishlist', () => {
      it('should request the SKUs of the preferred wishlist', () => {
        fixture.detectChanges();
        verify(wishlistFacadeMock.wishlistItemsSkus$('wl2')).once();
      });

      it('should emit the SKUs of the preferred wishlist only', done => {
        wishlists$.next([
          { ...wl1, items: [{ sku: 'sku-other', id: 'i0', creationDate: 1, desiredQuantity: { value: 1 } }] },
          {
            ...wl2,
            preferred: true,
            itemsCount: 1,
            items: [{ sku: 'sku-preferred', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }],
          },
        ]);
        fixture.detectChanges();
        component.wishlistItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku-preferred']);
          done();
        });
      });
    });

    describe('without a preferred wishlist', () => {
      beforeEach(() => {
        wishlists$.next([
          { ...wl1, preferred: false },
          { ...wl3, preferred: false },
        ]);
      });

      it('should request the SKUs of all wishlists', () => {
        fixture.detectChanges();
        verify(wishlistFacadeMock.wishlistItemsSkus$(undefined)).once();
      });

      it('should emit the SKUs of all wishlists', done => {
        wishlists$.next([
          {
            ...wl1,
            preferred: false,
            items: [{ sku: 'sku1', id: 'i1', creationDate: 1, desiredQuantity: { value: 1 } }],
          },
          {
            ...wl3,
            preferred: false,
            items: [{ sku: 'sku3', id: 'i2', creationDate: 2, desiredQuantity: { value: 1 } }],
          },
        ]);
        fixture.detectChanges();
        component.wishlistItemsSkus$.subscribe(skus => {
          expect(skus).toEqual(['sku1', 'sku3']);
          done();
        });
      });
    });

    describe('empty wishlists', () => {
      it('should emit an empty array when wishlists list is empty', done => {
        wishlists$.next([]);
        fixture.detectChanges();
        component.wishlistItemsSkus$.subscribe(skus => {
          expect(skus).toBeEmpty();
          done();
        });
      });
    });
  });
});
