import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';
import { SelectWishlistModalComponent } from '../select-wishlist-modal/select-wishlist-modal.component';

import { WishlistLineItemComponent } from './wishlist-line-item.component';

@Directive({
  selector: '[ishProductContextAccess]',
  standalone: true,
})
class MockProductContextAccessDirective {
  constructor(templateRef: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    viewContainerRef.createEmbeddedView(templateRef, { product: { sku: 'sku' }, context: {} });
  }

  static ngTemplateContextGuard(
    _: MockProductContextAccessDirective,
    ctx: unknown
  ): ctx is { product: { sku: string } } {
    return !!ctx || true;
  }
}

describe('Wishlist Line Item Component', () => {
  let component: WishlistLineItemComponent;
  let fixture: ComponentFixture<WishlistLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistLineItemComponent],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) }],
    })
      .overrideComponent(WishlistLineItemComponent, {
        remove: {
          imports: [
            DatePipe,
            ProductAddToBasketComponent,
            ProductBundleDisplayComponent,
            ProductContextAccessDirective,
            ProductIdComponent,
            ProductImageComponent,
            ProductInventoryComponent,
            ProductNameComponent,
            ProductPriceComponent,
            ProductQuantityComponent,
            ProductVariationDisplayComponent,
            SelectWishlistModalComponent,
            TranslatePipe,
          ],
        },
        add: {
          imports: [
            MockPipe(DatePipe),
            MockPipe(TranslatePipe),
            MockComponent(ProductAddToBasketComponent),
            MockComponent(ProductBundleDisplayComponent),
            MockProductContextAccessDirective,
            MockComponent(ProductIdComponent),
            MockComponent(ProductImageComponent),
            MockComponent(ProductInventoryComponent),
            MockComponent(ProductNameComponent),
            MockComponent(ProductPriceComponent),
            MockComponent(ProductQuantityComponent),
            MockComponent(ProductVariationDisplayComponent),
            MockComponent(SelectWishlistModalComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.wishlistItemData = { sku: 'sku', creationDate: new Date().toISOString() } as never;
    component.currentWishlist = { id: 'wishlist-1' } as never;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
