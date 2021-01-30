import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../select-wishlist-modal/select-wishlist-modal.component';

import { ProductAddToWishlistComponent } from './product-add-to-wishlist.component';

describe('Product Add To Wishlist Component', () => {
  let component: ProductAddToWishlistComponent;
  let fixture: ComponentFixture<ProductAddToWishlistComponent>;
  let element: HTMLElement;
  let wishlistFacadeMock: WishlistsFacade;
  let accountFacadeMock: AccountFacade;

  const wishlistDetails = [
    {
      title: 'testing wishlist',
      type: 'WishList',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      preferred: true,
      public: false,
    },
    {
      title: 'testing wishlist 2',
      type: 'WishList',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      preferred: false,
      public: false,
    },
    {
      title: 'new wishlist',
      type: 'Wishlist',
      id: 'new wishlist id',
      itemsCount: 0,
      preferred: false,
      public: false,
    },
  ];

  beforeEach(async () => {
    wishlistFacadeMock = mock(WishlistsFacade);
    when(wishlistFacadeMock.wishlists$).thenReturn(of(wishlistDetails));
    accountFacadeMock = mock(AccountFacade);
    const context = mock(ProductContextFacade);
    when(context.get('sku')).thenReturn('test sku');

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(SelectWishlistModalComponent),
        ProductAddToWishlistComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToWishlistComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call wishlistFacade to add product to wishlist', () => {
    fixture.detectChanges();
    component.addProductToWishlist({ id: 'testid', title: 'Test Wishlist' });
    verify(wishlistFacadeMock.addProductToWishlist(anyString(), anyString())).once();
  });

  it('should call wishlistFacade to add product to new wishlist', () => {
    fixture.detectChanges();
    component.addProductToWishlist({ id: undefined, title: 'Test Wishlist' });
    verify(wishlistFacadeMock.addProductToNewWishlist(anyString(), anyString())).once();
  });
});
