import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductQuantityComponent } from './product-quantity.component';

describe('Product Quantity Component', () => {
  let component: ProductQuantityComponent;
  let fixture: ComponentFixture<ProductQuantityComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [TranslateService],
      declarations: [
        ProductQuantityComponent,
        MockComponent({
          selector: 'ish-select',
          template: '<select> </select>',
          inputs: ['options', 'controlName', 'form', 'label', 'labelClass', 'inputClass'],
        }),
        MockComponent({
          selector: 'ish-input',
          template: '<input type="number" />',
          inputs: [
            'options',
            'controlName',
            'form',
            'label',
            'labelClass',
            'inputClass',
            'markRequiredLabel',
            'min',
            'max',
            'value',
            'errorMessages',
            'type',
          ],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuantityComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    product.inStock = true;
    product.minOrderQuantity = 1;
    product.availability = true;
    element = fixture.nativeElement;
    component.product = product;
    component.controlName = 'quantity';
    component.parentForm = new FormGroup({});
    component.parentForm.addControl(component.controlName, new FormControl(1));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should not render when inStock = false', () => {
    product.inStock = false;
    fixture.detectChanges();
    expect(element.querySelector('input[type="number"]')).toBeFalsy();
  });

  it('should display number input when type is not select', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[type="number"]')).toBeTruthy();
  });
});
