import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { WishlistsFacade } from '../../facades/wishlists.facade';
import { WishlistLineItemComponent } from '../../shared/wishlist-line-item/wishlist-line-item.component';

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
      imports: [SharedWishlistPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) }],
    })
      .overrideComponent(SharedWishlistPageComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockComponent(LoadingComponent),
            MockDirective(ProductContextDirective),
            TranslatePipe,
            MockComponent(WishlistLineItemComponent),
          ],
        },
      })
      .compileComponents();
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
