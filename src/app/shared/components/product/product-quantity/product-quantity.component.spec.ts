import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CounterComponent } from 'ish-shared/forms/components/counter/counter.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent } from 'ish-shared/forms/components/select/select.component';

import { ProductQuantityComponent } from './product-quantity.component';

describe('Product Quantity Component', () => {
  let component: ProductQuantityComponent;
  let fixture: ComponentFixture<ProductQuantityComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(CounterComponent),
        MockComponent(InputComponent),
        MockComponent(SelectComponent),
        ProductQuantityComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuantityComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    product.minOrderQuantity = 1;
    product.available = true;
    element = fixture.nativeElement;
    component.product = product;
    component.controlName = 'quantity';
    component.parentForm = new FormGroup({});
    component.parentForm.addControl(component.controlName, new FormControl(1));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render when product not available', () => {
    product.available = false;
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toBeEmpty();
  });

  it('should display number input when type is not select', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('ish-input');
  });

  it('should be read-only when configured that way', () => {
    component.readOnly = true;
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.quantity.label: 1"`);
  });
});
