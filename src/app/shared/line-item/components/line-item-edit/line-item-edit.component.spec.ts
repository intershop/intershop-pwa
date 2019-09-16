import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/common/components/modal-dialog/modal-dialog.component';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';
import { LineItemEditDialogComponent } from 'ish-shared/line-item/components/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditDialogContainerComponent } from 'ish-shared/line-item/containers/line-item-edit-dialog/line-item-edit-dialog.container';
import { ProductIdComponent } from 'ish-shared/product/components/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/product/components/product-inventory/product-inventory.component';
import { ProductVariationSelectComponent } from 'ish-shared/product/components/product-variation-select/product-variation-select.component';
import { ProductImageComponent } from 'ish-shell/header/components/product-image/product-image.component';

import { LineItemEditComponent } from './line-item-edit.component';

describe('Line Item Edit Component', () => {
  let component: LineItemEditComponent;
  let fixture: ComponentFixture<LineItemEditComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsSharedModule,
        PipesModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [
        LineItemEditComponent,
        LineItemEditDialogComponent,
        LineItemEditDialogContainerComponent,
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductVariationSelectComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
