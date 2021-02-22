import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from '../../../wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { QuoteContextFacade } from '../../facades/quote-context.facade';

import { QuoteLineItemListElementComponent } from './quote-line-item-list-element.component';

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
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockPipe(PricePipe),
        QuoteLineItemListElementComponent,
      ],
      providers: [
        { provide: QuoteContextFacade, useFactory: () => instance(quoteContext) },
        { provide: ProductContextFacade, useFactory: () => instance(productContext) },
      ],
    }).compileComponents();
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
      Array [
        "ish-product-image",
        "ish-product-name",
        "ish-product-id",
        "ish-product-variation-display",
        "ish-product-bundle-display",
        "ish-product-inventory",
      ]
    `);
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "product-list-item",
        "total-price",
      ]
    `);
  });

  it('should render all sub elements when initialized editable', () => {
    when(quoteContext.select('editable')).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-image",
        "ish-product-name",
        "ish-product-id",
        "ish-product-variation-display",
        "ish-product-bundle-display",
        "ish-product-inventory",
        "ish-lazy-product-add-to-order-template",
        "ish-lazy-product-add-to-wishlist",
        "fa-icon",
        "ish-product-quantity",
        "ish-product-quantity",
      ]
    `);
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "product-list-item",
        "remove-pli-item123-element",
        "total-price",
      ]
    `);
  });

  it('should use context to delete items', () => {
    component.onDeleteItem();

    verify(quoteContext.deleteItem(anything())).once();
    expect(capture(quoteContext.deleteItem).last()).toMatchInlineSnapshot(`
      Array [
        "item123",
      ]
    `);
  });
});
