import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { ProductImagesComponent } from './product-images.component';

describe('Product Images Component', () => {
  let component: ProductImagesComponent;
  let fixture: ComponentFixture<ProductImagesComponent>;
  let product: Product;
  let element: HTMLElement;

  beforeEach(async () => {
    product = { sku: 'sku' } as Product;
    product.name = 'Lenco';
    product.images = [
      {
        name: 'front S',
        type: 'Image',
        imageActualHeight: 110,
        imageActualWidth: 110,
        viewID: 'front',
        effectiveUrl: '/assets/product_img/a.jpg',
        typeID: 'S',
        primaryImage: true,
      },
      {
        name: 'front S',
        type: 'Image',
        imageActualHeight: 110,
        imageActualWidth: 110,
        viewID: 'front',
        effectiveUrl: '/assets/product_img/a.jpg',
        typeID: 'S',
        primaryImage: false,
      },
      {
        name: 'front L',
        type: 'Image',
        imageActualHeight: 500,
        imageActualWidth: 500,
        viewID: 'front',
        effectiveUrl: '/assets/product_img/a.jpg',
        typeID: 'L',
        primaryImage: true,
      },
      {
        name: 'front L',
        type: 'Image',
        imageActualHeight: 500,
        imageActualWidth: 500,
        viewID: 'front',
        effectiveUrl: '/assets/product_img/a.jpg',
        typeID: 'L',
        primaryImage: false,
      },
    ];
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule],
      declarations: [
        MockComponent(ProductImageComponent),
        MockComponent(ProductLabelComponent),
        ProductImagesComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;
    component.activeSlide = '0';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render carousel on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('carousel-item')).toHaveLength(2);
  });

  it('should render thumbnails on component', () => {
    fixture.detectChanges();
    const thumbNailsSetElement = element.getElementsByClassName('product-thumb-set');
    expect(thumbNailsSetElement).toHaveLength(2);
    const productImageElem = thumbNailsSetElement[0].querySelector('ish-product-image');
    expect(productImageElem.getAttribute('ng-reflect-image-type')).toBe(component.product.images[0].typeID);
  });

  it('should show corresponding image in carousel and set active class on thumbnail when clicking on thumbnail image', () => {
    fixture.detectChanges();
    (element.getElementsByClassName('product-thumb-set')[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-thumb-set')[1].getAttribute('class')).toContain('active');
    expect(component.activeSlide).toEqual('1');
  });

  it('should render product image component on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toBeTruthy();
  });
});
