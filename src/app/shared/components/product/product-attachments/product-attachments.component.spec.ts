import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';

import { ProductAttachmentsComponent } from './product-attachments.component';

describe('Product Attachments Component', () => {
  let component: ProductAttachmentsComponent;
  let fixture: ComponentFixture<ProductAttachmentsComponent>;
  let element: HTMLElement;
  let product: Product;

  beforeEach(async () => {
    product = { sku: 'sku' } as Product;
    product.attachments = [
      {
        name: 'A',
        type: 'typeA',
        value: 'valueA',
        key: 'keyA',
        description: 'descriptionA',
        link: {
          title: 'titleA',
          type: 'typeA',
          uri: 'uriA',
        },
      },
    ];
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductAttachmentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttachmentsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
