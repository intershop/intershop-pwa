import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MockComponent } from '../../../../dev-utils/mock.component';
import { Product } from '../../../../models/product/product.model';
import { ProductImagesComponent } from './product-images.component';

describe('Product Images Component', () => {
  let component: ProductImagesComponent;
  let fixture: ComponentFixture<ProductImagesComponent>;
  let product: Product;
  let element: HTMLElement;
  beforeEach(async(() => {
    product = new Product('sku');
    product.name = 'Lenco';
    product.images = [
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'S',
        'primaryImage': true
      },
      {
        'name': 'front S',
        'type': 'Image',
        'imageActualHeight': 110,
        'imageActualWidth': 110,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'S',
        'primaryImage': false
      },
      {
        'name': 'front L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/a.jpg',
        'typeID': 'L',
        'primaryImage': true
      },
      {
        'name': 'front L',
        'type': 'Image',
        'imageActualHeight': 500,
        'imageActualWidth': 500,
        'viewID': 'front',
        'effectiveUrl': '/assets/product_img/b.jpg',
        'typeID': 'L',
        'primaryImage': false
      }

    ];
    TestBed.configureTestingModule({
      imports: [CarouselModule.forRoot()],
      declarations: [ProductImagesComponent,
        MockComponent({
          selector: 'ish-product-image', template:
            '<img src="/assets/product_img/b.jpg" />',
          inputs: ['product', 'imageType', 'class', 'imageView']
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = product;
    component.activeSlide = 0;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should test if carousel are rendered correctly', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('slide').length).toEqual(2);
  });

  it('should test if tumbnails are rendered correctly', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-thumb-set').length).toEqual(2);
  });

  it('should test if click on tumbnail show that image in carousel and set active class on tumbnail', () => {
    fixture.detectChanges();
    (element.getElementsByClassName('product-thumb-set')[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-thumb-set')[1].getAttribute('class')).toContain('active');
    expect(component.activeSlide).toEqual(1);
  });

  it('should test if product image component is getting rendered', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toBeTruthy();
  });
});
