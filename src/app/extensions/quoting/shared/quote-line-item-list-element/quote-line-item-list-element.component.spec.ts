import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllCustomElements, findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { ProductAddToOrderTemplateComponent } from '../../../order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToWishlistComponent } from '../../../wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';
import { QuoteContextFacade } from '../../facades/quote-context.facade';

import { QuoteLineItemListElementComponent } from './quote-line-item-list-element.component';

@Directive({
  selector: '[ishFeature]',
  standalone: true,
})
class MockFeatureToggleDirective {
  @Input('ishFeature') feature: unknown;

  constructor(templateRef: TemplateRef<unknown>, viewContainer: ViewContainerRef) {
    viewContainer.createEmbeddedView(templateRef);
  }
}

describe('Quote Line Item List Element Component', () => {
  let component: QuoteLineItemListElementComponent;
  let fixture: ComponentFixture<QuoteLineItemListElementComponent>;
  let element: HTMLElement;
  let quoteContext: QuoteContextFacade;
  let productContext: ProductContextFacade;

  beforeEach(async () => {
    productContext = mock(ProductContextFacade);
    when(productContext.select('product')).thenReturn(
      of({
        sku: '123',
      } as ProductView)
    );

    quoteContext = mock(QuoteContextFacade);

    await TestBed.configureTestingModule({
      imports: [QuoteLineItemListElementComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(productContext) },
        { provide: QuoteContextFacade, useFactory: () => instance(quoteContext) },
      ],
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
    })
      .overrideComponent(QuoteLineItemListElementComponent, {
        remove: {
          imports: [
            PricePipe,
            ProductAddToOrderTemplateComponent,
            ProductAddToWishlistComponent,
            ProductBundleDisplayComponent,
            ProductIdComponent,
            ProductImageComponent,
            ProductInventoryComponent,
            ProductNameComponent,
            ProductQuantityComponent,
            ProductQuantityLabelComponent,
            ProductVariationDisplayComponent,
          ],
        },
        add: {
          imports: [
            MockFeatureToggleDirective,
            MockPipe(PricePipe),
            MockComponent(ProductAddToOrderTemplateComponent),
            MockComponent(ProductAddToWishlistComponent),
            MockComponent(ProductBundleDisplayComponent),
            MockComponent(ProductIdComponent),
            MockComponent(ProductImageComponent),
            MockComponent(ProductInventoryComponent),
            MockComponent(ProductNameComponent),
            MockComponent(ProductQuantityComponent),
            MockComponent(ProductQuantityLabelComponent),
            MockComponent(ProductVariationDisplayComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemListElementComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItem = {
      id: 'item123',
      quantity: { name: 'Attr', value: 3 },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render all sub elements when initialized read only', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-product-image",
        "ish-product-name",
        "ish-product-id",
        "ish-product-variation-display",
        "ish-product-bundle-display",
        "ish-product-inventory",
        "ish-product-quantity-label",
      ]
    `);
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "product-list-item",
        "total-price",
      ]
    `);
  });

  it('should render all sub elements when initialized editable', async () => {
    when(quoteContext.select('editable')).thenReturn(of(true));

    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-product-image",
        "ish-product-name",
        "ish-product-id",
        "ish-product-variation-display",
        "ish-product-bundle-display",
        "ish-product-inventory",
        "ish-product-add-to-order-template",
        "ish-product-add-to-wishlist",
        "ish-product-quantity-label",
        "ish-product-quantity",
        "ish-product-quantity",
      ]
    `);
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "product-list-item",
        "remove-line-item",
        "total-price",
      ]
    `);
  });

  it('should use context to delete items', () => {
    component.onDeleteItem();

    verify(quoteContext.deleteItem(anything())).once();
    expect(capture(quoteContext.deleteItem).last()).toMatchInlineSnapshot(`
      [
        "item123",
      ]
    `);
  });
});
