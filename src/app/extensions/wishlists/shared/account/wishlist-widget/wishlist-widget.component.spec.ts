import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { WishlistsFacade } from '../../../facades/wishlists.facade';

import { WishlistWidgetComponent } from './wishlist-widget.component';

describe('Wishlist Widget Component', () => {
  let component: WishlistWidgetComponent;
  let fixture: ComponentFixture<WishlistWidgetComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const wishlistFacadeMock = mock(WishlistsFacade);
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductItemComponent), WishlistWidgetComponent],
      imports: [RouterTestingModule, SwiperModule, TranslateModule.forRoot()],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    }).compileComponents();
  }));

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
});
