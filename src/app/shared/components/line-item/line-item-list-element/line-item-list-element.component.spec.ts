import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LineItemCustomFieldsComponent } from 'ish-shared/components/line-item/line-item-custom-fields/line-item-custom-fields.component';
import { LineItemEditComponent } from 'ish-shared/components/line-item/line-item-edit/line-item-edit.component';
import { LineItemWarrantyComponent } from 'ish-shared/components/line-item/line-item-warranty/line-item-warranty.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { LineItemListElementComponent } from './line-item-list-element.component';

describe('Line Item List Element Component', () => {
  let component: LineItemListElementComponent;
  let fixture: ComponentFixture<LineItemListElementComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({} as ProductView));
    when(context.select('quantity')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        LineItemListElementComponent,
        MockComponent(FaIconComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(LineItemCustomFieldsComponent),
        MockComponent(LineItemEditComponent),
        MockComponent(LineItemWarrantyComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductQuantityLabelComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockDirective(NgbPopover),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListElementComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('editable', () => {
    beforeEach(() => {
      component.editable = true;
    });

    it('should render item quantity change input field if editable === true', () => {
      fixture.detectChanges();
      expect(element.querySelector('ish-product-quantity')).toBeTruthy();
    });

    it('should not render item quantity change input field if editable === false', () => {
      component.editable = false;
      fixture.detectChanges();
      expect(element.querySelector('ish-product-quantity')).not.toBeTruthy();
    });

    it('should render item delete button if editable === true', () => {
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,trash-alt"]')).toBeTruthy();
    });

    it('should not render item delete button if editable === false', () => {
      component.editable = false;
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,trash-alt"]')).toBeFalsy();
    });
  });

  it('should give correct sku to productIdComponent', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-id')).toMatchInlineSnapshot(`<ish-product-id></ish-product-id>`);
  });

  it('should hold itemSurcharges for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('.details-tooltip')).toHaveLength(1);
  });

  it('should not display itemSurcharges for the line item if not available', () => {
    component.pli = { ...BasketMockData.getBasketItem(), itemSurcharges: undefined };
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelectorAll('.details-tooltip')).toHaveLength(0);
  });

  it('should display standard elements for normal products', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-product-image",
          "ish-product-name",
          "ish-product-id",
          "ish-line-item-custom-fields",
          "ish-product-variation-display",
          "ish-product-bundle-display",
          "ish-line-item-edit",
          "ish-product-inventory",
          "ish-product-shipment",
          "fa-icon",
          "ish-lazy-product-add-to-order-template",
          "ish-lazy-product-add-to-wishlist",
          "fa-icon",
          "ish-product-quantity-label",
          "ish-product-quantity",
          "ish-product-quantity",
          "ish-line-item-warranty",
        ]
      `);
  });

  it('should display bundle parts for bundle products', () => {
    when(context.select('product')).thenReturn(of({ type: 'Bundle' } as ProductView));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-product-bundle-display');
  });
});
