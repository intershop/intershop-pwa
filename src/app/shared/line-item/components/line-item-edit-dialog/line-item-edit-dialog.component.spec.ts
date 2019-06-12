import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { PipesModule } from 'ish-core/pipes.module';
import { ProductImageComponent } from '../../../../shell/header/components/product-image/product-image.component';
import { LoadingComponent } from '../../../common/components/loading/loading.component';
import { FormsSharedModule } from '../../../forms/forms.module';
import { ProductInventoryComponent } from '../../../product/components/product-inventory/product-inventory.component';
import { ProductVariationSelectComponent } from '../../../product/components/product-variation-select/product-variation-select.component';

import { LineItemEditDialogComponent } from './line-item-edit-dialog.component';

describe('Line Item Edit Dialog Component', () => {
  let component: LineItemEditDialogComponent;
  let fixture: ComponentFixture<LineItemEditDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsSharedModule, PipesModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        LineItemEditDialogComponent,
        MockComponent(LoadingComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        ProductVariationSelectComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
