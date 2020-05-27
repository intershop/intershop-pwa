import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { SelectOrderTemplateModalComponent } from '../../../shared/order-templates/select-order-template-modal/select-order-template-modal.component';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item.component';

describe('Account Order Template Detail Line Item Component', () => {
  let component: AccountOrderTemplateDetailLineItemComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateDetailLineItemComponent,
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPriceComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(SelectOrderTemplateModalComponent),
        MockPipe(DatePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: coreReducers,
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.orderTemplateItemData = {
      id: '1234',
      sku: 'abdc',
      creationDate: 123124124,
      desiredQuantity: { value: 1 },
    };
    component.selectItemForm = new FormGroup({
      sku: new FormControl('abcd'),
      productCheckbox: new FormControl(true),
    });
    const selectedItemsFormGroup: FormGroup[] = [];
    selectedItemsFormGroup.push(component.selectItemForm);
    component.selectedItemsForm = new FormArray(selectedItemsFormGroup);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
