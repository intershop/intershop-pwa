import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Product } from 'ish-core/models/product/product.model';

import { ProductLabelComponent } from './product-label.component';

describe('Product Label Component', () => {
  let component: ProductLabelComponent;
  let fixture: ComponentFixture<ProductLabelComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductLabelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create HTML tag span when component is created', () => {
    const attributeGroup = {
      attributes: [{ name: 'sale', type: 'String', value: 'sale' }],
    } as AttributeGroup;
    component.product = {
      name: 'FakeProduct',
      sku: 'sku',
      attributeGroups: {
        [AttributeGroupTypes.ProductLabelAttributes]: attributeGroup,
      } as { [id: string]: AttributeGroup },
    } as Product;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('[class^="product-label product-label-sale"]')).not.toBeNull();
  });

  it('should not create HTML tag span when component is created', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('[class^="product-label product-label-sale"]')).toBeNull();
  });
});
