import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { Product } from '../../../../models/product/product.model';
import { ProductsService } from '../../../services/products/products.service';
import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let element: HTMLElement;
  let productsService: ProductsService;
  const activatedRouteMock = {
    'url': of(
      [{ 'path': 'cameras', 'parameters': {} },
      { 'path': 'cameras', 'parameters': {} }
      ])
  };

  beforeEach(async(() => {
    productsService = mock(ProductsService);
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProductsService, useFactory: () => instance(productsService) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(productsService.getProductList(anything())).thenReturn(of([new Product('1')]));
  });

  xit('should retrieve products when created', () => {
    verify(productsService.getProductList(anything())).never();
    fixture.detectChanges();
    expect(component.products).not.toBe(null);
    verify(productsService.getProductList(anything())).once();
  });

  xit('should check if the data is being rendered on the page', () => {
    fixture.detectChanges();
    const thumbs = element.querySelectorAll('ish-product-tile');
    expect(thumbs.length).toBe(1);
  });
});
