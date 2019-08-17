import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ProductIdComponent } from '../../../../shared/product/components/product-id/product-id.component';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { LoadingComponent } from '../../../common/components/loading/loading.component';
import { ModalDialogComponent } from '../../../common/components/modal-dialog/modal-dialog.component';
import { FormsSharedModule } from '../../../forms/forms.module';
import { LineItemEditDialogComponent } from '../../../line-item/components/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from '../../../line-item/components/line-item-edit/line-item-edit.component';
import { LineItemEditDialogContainerComponent } from '../../../line-item/containers/line-item-edit-dialog/line-item-edit-dialog.container';
import { ProductInventoryComponent } from '../../../product/components/product-inventory/product-inventory.component';
import { ProductShipmentComponent } from '../../../product/components/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from '../../../product/components/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from '../../../product/components/product-variation-select/product-variation-select.component';
import { ProductBundleDisplayContainerComponent } from '../../../product/containers/product-bundle-display/product-bundle-display.container';

import { LineItemDescriptionComponent } from './line-item-description.component';

describe('Line Item Description Component', () => {
  let component: LineItemDescriptionComponent;
  let fixture: ComponentFixture<LineItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsSharedModule,
        IconModule,
        NgbPopoverModule,
        PipesModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
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
});
