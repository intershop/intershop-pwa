import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CartStatusService } from '../../../../core/services/cart-status/cart-status.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product } from '../../../../models/product/product.model';
import { DisableIconDirective } from '../../../directives/disable-icon.directive';
import { ProductRowComponent } from './product-row.component';

/*
  TODO: commented out tests fail with "ReferenceError: Can't find variable: Intl in vendor.bundle.js (line 56892)"
 */
describe('Product Row Component', () => {
  let fixture: ComponentFixture<ProductRowComponent>;
  let component: ProductRowComponent;
  let element: HTMLElement;
  let cartStatusServiceMock: CartStatusService;
  let product: Product;

  beforeEach(async(() => {
    cartStatusServiceMock = mock(CartStatusService);
    product = new Product('sku');
    product.name = 'Lenco';
    product.images = [
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'S',
        'primaryImage': true
      },
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'S',
        'primaryImage': false
      },
      {
        'name': 'front L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'front',
        'effectiveUrl': 'test.jpg',
        'typeID': 'L',
        'primaryImage': true
      }
    ];
    when(cartStatusServiceMock.getValue()).thenReturn([]);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductRowComponent, DisableIconDirective],
      providers: [
        { provide: CartStatusService, useFactory: () => instance(cartStatusServiceMock) },
        { provide: ICM_BASE_URL, useValue: 'http://www.example.org' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    TranslateModule.forRoot();
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should modify product when received', () => {
    fixture.detectChanges();
    expect(component.product).not.toBeNull();
  });

  it('should call service when added to cart', () => {
    component.addToCart();
    verify(cartStatusServiceMock.addSKU(anything())).once();
  });

  it('should test if the tags are getting rendered', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('img')).toBeTruthy();
  });

  it('should test if product image component is getting rendered', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toBeTruthy();
  });

  it('should test if product inventory component is getting rendered', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-inventory')).toBeTruthy();
  });
});
