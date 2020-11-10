import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { findAllCustomElements, findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from '../../../wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { QuoteContextFacade } from '../../facades/quote-context.facade';

import { QuoteLineItemListElementComponent } from './quote-line-item-list-element.component';

describe('Quote Line Item List Element Component', () => {
  let component: QuoteLineItemListElementComponent;
  let fixture: ComponentFixture<QuoteLineItemListElementComponent>;
  let element: HTMLElement;
  let quoteContext: QuoteContextFacade;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(anything(), anything())).thenReturn(
      of({
        sku: '123',
      } as ProductView)
    );

    quoteContext = mock(QuoteContextFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
        QuoteLineItemListElementComponent,
      ],
      providers: [
        { provide: QuoteContextFacade, useFactory: () => instance(quoteContext) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemListElementComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItem = {
      id: 'item123',
      quantity: { value: 3 },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render all sub elements when initialized read only', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-image",
        "ish-product-id",
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

    component.ngOnChanges();
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-image",
        "ish-product-id",
        "ish-product-inventory",
        "ish-lazy-product-add-to-order-template",
        "ish-lazy-product-add-to-wishlist",
        "fa-icon",
        "ish-input",
        "ish-input",
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
