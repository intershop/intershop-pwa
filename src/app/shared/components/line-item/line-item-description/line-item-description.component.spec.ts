import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LineItemEditComponent } from 'ish-shared/components/line-item/line-item-edit/line-item-edit.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { LineItemDescriptionComponent } from './line-item-description.component';

describe('Line Item Description Component', () => {
  let component: LineItemDescriptionComponent;
  let fixture: ComponentFixture<LineItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(), TranslateModule.forRoot()],
      declarations: [
        LineItemDescriptionComponent,
        MockComponent(FaIconComponent),
        MockComponent(LineItemEditComponent),
        MockComponent(NgbPopover),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockPipe(PricePipe),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
    component.product = {} as ProductView;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
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
      Array [
        "ish-product-id",
        "ish-line-item-edit",
        "ish-product-inventory",
        "ish-product-shipment",
        "fa-icon",
      ]
    `);
  });

  it('should display bundle parts for bundle products', () => {
    component.product.type = 'Bundle';
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-product-bundle-display');
  });

  it('should not display edit component for variation products with advanced variation handling', () => {
    component.product.type = 'VariationProduct';
    FeatureToggleModule.switchTestingFeatures('advancedVariationHandling');
    fixture.detectChanges();
    expect(findAllCustomElements(element)).not.toContain('ish-line-item-edit');
  });
});
