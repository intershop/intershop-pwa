import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { AttributeToStringPipe } from '../../../../models/attribute/attribute.pipe';
import { Product } from '../../../../models/product/product.model';
import { ProductAttributesComponent } from './product-attributes.component';

describe('Product Attributes Component', () => {
  let component: ProductAttributesComponent;
  let fixture: ComponentFixture<ProductAttributesComponent>;
  let element: HTMLElement;
  let product: Product;
  beforeEach(
    async(() => {
      product = { sku: 'sku' } as Product;
      product.attributes = [{ name: 'A', type: 'String', value: 'A' }, { name: 'B', type: 'String', value: 'B' }];
      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
        declarations: [ProductAttributesComponent, AttributeToStringPipe],
        providers: [CurrencyPipe, DatePipe, DecimalPipe],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product attributes when available', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('dt').length).toEqual(2);
    expect(element.getElementsByClassName('ish-ca-type').length).toEqual(2);
    expect(element.getElementsByClassName('ish-ca-value').length).toEqual(2);
  });

  it('should render product attributes name and value when available', () => {
    product.attributes = [{ name: 'A', type: 'String', value: 'A' }];
    fixture.detectChanges();
    expect(element.querySelector('.ish-ca-type').textContent).toEqual('A:');
    expect(element.querySelector('.ish-ca-value').textContent).toEqual('A');
  });

  it('should render product attributes name and multiple value when available', () => {
    product.attributes = [{ name: 'A', type: 'MultipleString', value: ['hallo', 'welt'] }];
    component.multipleValuesSeparator = ':::';
    fixture.detectChanges();
    expect(element.querySelector('.ish-ca-type').textContent).toEqual('A:');
    expect(element.querySelector('.ish-ca-value').textContent).toEqual('hallo:::welt');
  });
});
