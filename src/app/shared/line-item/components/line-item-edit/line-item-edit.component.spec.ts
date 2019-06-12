import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { LoadingComponent } from '../../../common/components/loading/loading.component';
import { ModalDialogComponent } from '../../../common/components/modal-dialog/modal-dialog.component';
import { FormsSharedModule } from '../../../forms/forms.module';
import { ProductInventoryComponent } from '../../../product/components/product-inventory/product-inventory.component';
import { ProductVariationSelectComponent } from '../../../product/components/product-variation-select/product-variation-select.component';
import { LineItemEditDialogContainerComponent } from '../../containers/line-item-edit-dialog/line-item-edit-dialog.container';
import { LineItemEditDialogComponent } from '../line-item-edit-dialog/line-item-edit-dialog.component';

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
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        LineItemEditComponent,
        LineItemEditDialogComponent,
        LineItemEditDialogContainerComponent,
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        ProductVariationSelectComponent,
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
