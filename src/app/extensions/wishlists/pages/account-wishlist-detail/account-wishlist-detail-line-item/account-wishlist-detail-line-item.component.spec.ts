import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../../../shared/wishlists/select-wishlist-modal/select-wishlist-modal.component';

import { AccountWishlistDetailLineItemComponent } from './account-wishlist-detail-line-item.component';

describe('Account Wishlist Detail Line Item Component', () => {
  let component: AccountWishlistDetailLineItemComponent;
  let fixture: ComponentFixture<AccountWishlistDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountWishlistDetailLineItemComponent,
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(SelectWishlistModalComponent),
        MockPipe(DatePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWishlistDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
