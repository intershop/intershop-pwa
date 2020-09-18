import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { ProductAttributesComponent } from './product-attributes.component';

describe('Product Attributes Component', () => {
  let component: ProductAttributesComponent;
  let fixture: ComponentFixture<ProductAttributesComponent>;
  let element: HTMLElement;
  let product: Product;
  beforeEach(async () => {
    product = { sku: 'sku' } as Product;
    product.attributes = [
      { name: 'A', type: 'String', value: 'A' },
      { name: 'B', type: 'String', value: 'B' },
    ];
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AttributeToStringPipe, ProductAttributesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;

    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product attributes when available', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('dt')).toHaveLength(2);
    expect(element.getElementsByClassName('attribute-type')).toHaveLength(2);
    expect(element.getElementsByClassName('attribute-value')).toHaveLength(2);
  });

  it('should render product attributes name and value when available', () => {
    product.attributes = [{ name: 'A', type: 'String', value: 'A' }];
    fixture.detectChanges();
    expect(element.querySelector('.attribute-type').textContent).toEqual('A:');
    expect(element.querySelector('.attribute-value').textContent).toEqual('A');
  });

  it('should render product attributes name and multiple value when available', () => {
    product.attributes = [{ name: 'A', type: 'MultipleString', value: ['hallo', 'welt'] }];
    component.multipleValuesSeparator = ':::';
    fixture.detectChanges();
    expect(element.querySelector('.attribute-type').textContent).toEqual('A:');
    expect(element.querySelector('.attribute-value').textContent).toEqual('hallo:::welt');
  });
});
