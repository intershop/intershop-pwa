import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/common/components/modal-dialog/modal-dialog.component';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';
import { LineItemEditDialogComponent } from 'ish-shared/line-item/components/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from 'ish-shared/line-item/components/line-item-edit/line-item-edit.component';
import { LineItemEditDialogContainerComponent } from 'ish-shared/line-item/containers/line-item-edit-dialog/line-item-edit-dialog.container';
import { ProductIdComponent } from 'ish-shared/product/components/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/product/components/product-inventory/product-inventory.component';
import { ProductShipmentComponent } from 'ish-shared/product/components/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from 'ish-shared/product/components/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/product/components/product-variation-select/product-variation-select.component';
import { ProductBundleDisplayContainerComponent } from 'ish-shared/product/containers/product-bundle-display/product-bundle-display.container';
import { ProductImageComponent } from 'ish-shell/header/components/product-image/product-image.component';

import { LineItemDescriptionComponent } from './line-item-description.component';

describe('Line Item Description Component', () => {
  let component: LineItemDescriptionComponent;
  let fixture: ComponentFixture<LineItemDescriptionComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        FormsSharedModule,
        IconModule,
        NgbPopoverModule,
        PipesModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        LineItemDescriptionComponent,
        LineItemEditComponent,
        LineItemEditDialogComponent,
        LineItemEditDialogContainerComponent,
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductBundleDisplayContainerComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(ProductVariationSelectComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
    store$ = TestBed.get(Store);
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
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-line-item-edit",
        "ish-product-id",
        "ish-product-inventory",
        "ish-product-shipment",
      ]
    `);
  });

  it('should display bundle parts for bundle products', () => {
    component.pli.product.type = 'Bundle';
    fixture.detectChanges();
    expect(findAllIshElements(element)).toContain('ish-product-bundle-display-container');
  });

  it('should not display edit component for variation products with advanced variation handling', () => {
    component.pli.product.type = 'VariationProduct';
    store$.dispatch(new ApplyConfiguration({ features: ['advancedVariationHandling'] }));
    fixture.detectChanges();
    expect(findAllIshElements(element)).not.toContain('ish-line-item-edit');
  });
});
