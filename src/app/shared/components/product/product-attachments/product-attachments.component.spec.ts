import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
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
        key: 'keyA',
        description: 'descriptionA',
        url: 'urlA',
      },
    ];
    await TestBed.configureTestingModule({
      declarations: [ProductAttachmentsComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttachmentsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
