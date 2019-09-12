import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { Observable, of } from 'rxjs';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';
import { LineItemEditDialogComponent } from 'ish-shared/line-item/components/line-item-edit-dialog/line-item-edit-dialog.component';
import { ProductIdComponent } from 'ish-shared/product/components/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/product/components/product-inventory/product-inventory.component';
import { ProductRowComponent } from 'ish-shared/product/components/product-row/product-row.component';
import { ProductTileComponent } from 'ish-shared/product/components/product-tile/product-tile.component';
import { ProductVariationSelectComponent } from 'ish-shared/product/components/product-variation-select/product-variation-select.component';
import { ProductImageComponent } from 'ish-shell/header/components/product-image/product-image.component';

import { LineItemEditDialogContainerComponent } from './line-item-edit-dialog.container';

describe('Line Item Edit Dialog Container', () => {
  let component: LineItemEditDialogContainerComponent;
  let fixture: ComponentFixture<LineItemEditDialogContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsSharedModule,
        NgbModalModule,
        PipesModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        LineItemEditDialogComponent,
        LineItemEditDialogContainerComponent,
        MockComponent(LoadingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductRowComponent),
        MockComponent(ProductTileComponent),
        MockComponent(ProductVariationSelectComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditDialogContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = {} as LineItemView;

    component.lineItem.product = {
      sku: 'SKU',
      variableVariationAttributes: [],
      availability: true,
      inStock: true,
    } as VariationProductView;

    component.lineItem.quantity = {
      value: 5,
    };

    component.variation$ = of(component.lineItem.product) as Observable<VariationProductView>;
    component.loading$ = of(false);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should give correct product id of variation to product id component', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-id')).toMatchInlineSnapshot(`<ish-product-id></ish-product-id>`);
  });

  it('should display ish-components on the container', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toIncludeAllMembers([
      'ish-form-control-feedback',
      'ish-input',
      'ish-product-image',
    ]);
  });

  it('should display loading-components on the container', () => {
    component.loading$ = of(true);
    fixture.detectChanges();
    expect(findAllIshElements(element)).toIncludeAllMembers([
      'ish-form-control-feedback',
      'ish-input',
      'ish-loading',
      'ish-loading',
    ]);
  });
});
