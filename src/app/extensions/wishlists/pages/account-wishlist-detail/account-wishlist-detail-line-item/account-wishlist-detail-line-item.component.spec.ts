import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../../../shared/select-wishlist-modal/select-wishlist-modal.component';

import { AccountWishlistDetailLineItemComponent } from './account-wishlist-detail-line-item.component';

describe('Account Wishlist Detail Line Item Component', () => {
  let component: AccountWishlistDetailLineItemComponent;
  let fixture: ComponentFixture<AccountWishlistDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountWishlistDetailLineItemComponent,
        MockComponent(FaIconComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(SelectWishlistModalComponent),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) }],
    }).compileComponents();
  });

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
