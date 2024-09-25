import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { SharedWishlistPageComponent } from './shared-wishlist-page.component';

describe('Shared Wishlist Page Component', () => {
  let component: SharedWishlistPageComponent;
  let fixture: ComponentFixture<SharedWishlistPageComponent>;
  let element: HTMLElement;
  let wishlistFacadeMock: WishlistsFacade;

  const wishlist = {
    title: 'testing wishlist',
    type: 'WishList',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    preferred: true,
    public: false,
    shared: true,
  };

  beforeEach(async () => {
    wishlistFacadeMock = mock(WishlistsFacade);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), SharedWishlistPageComponent],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWishlistPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(wishlistFacadeMock.currentWishlist$).thenReturn(of(wishlist));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
