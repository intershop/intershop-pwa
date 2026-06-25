import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LineItemInformationEditComponent } from 'ish-shared/components/line-item/line-item-information-edit/line-item-information-edit.component';
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

import { ProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToWishlistComponent } from '../../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { LineItemListElementComponent } from './line-item-list-element.component';

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
      imports: [LineItemListElementComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        provideTranslateService(),
      ],
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
    })
      .overrideComponent(LineItemListElementComponent, {
        remove: {
          imports: [
            FeatureToggleDirective,
            LineItemInformationEditComponent,
            LineItemWarrantyComponent,
            NgbPopover,
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
            ProductShipmentComponent,
            ProductVariationDisplayComponent,
            ServerSettingPipe,
          ],
        },
        add: {
          imports: [
            MockFeatureToggleDirective,
            MockComponent(LineItemInformationEditComponent),
            MockComponent(LineItemWarrantyComponent),
            MockDirective(NgbPopover),
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
            MockComponent(ProductShipmentComponent),
            MockComponent(ProductVariationDisplayComponent),
            MockPipe(ServerSettingPipe, () => true),
          ],
        },
      })
      .compileComponents();
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
      expect(element.querySelector('i.bi-trash-fill')).toBeTruthy();
    });

    it('should not render item delete button if editable === false', () => {
      component.editable = false;
      fixture.detectChanges();
      expect(element.querySelector('i.bi-trash-fill')).toBeFalsy();
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

  it('should display standard elements for normal products', async () => {
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
        "ish-product-shipment",
        "ish-product-quantity-label",
        "ish-product-quantity",
        "ish-product-quantity",
        "ish-line-item-warranty",
        "ish-line-item-information-edit",
        "ish-product-add-to-order-template",
        "ish-product-add-to-wishlist",
      ]
    `);
  });

  it('should display bundle parts for bundle products', () => {
    when(context.select('product')).thenReturn(of({ type: 'Bundle' } as ProductView));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-product-bundle-display');
  });
});
