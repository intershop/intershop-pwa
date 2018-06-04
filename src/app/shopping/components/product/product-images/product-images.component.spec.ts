import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductImagesComponent } from './product-images.component';

describe('Product Images Component', () => {
  let component: ProductImagesComponent;
  let fixture: ComponentFixture<ProductImagesComponent>;
  let product: Product;
  let element: HTMLElement;
  beforeEach(async(() => {
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
        effectiveUrl: '/assets/product_img/b.jpg',
        typeID: 'L',
        primaryImage: false,
      },
    ];
    TestBed.configureTestingModule({
      imports: [CarouselModule.forRoot()],
      declarations: [
        ProductImagesComponent,
        MockComponent({
          selector: 'ish-product-image',
          template: '<img src="/assets/product_img/b.jpg" />',
          inputs: ['product', 'imageType', 'class', 'imageView'],
        }),
      ],
    }).compileComponents();
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
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render carousel on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('slide')).toHaveLength(2);
  });

  it('should render thumbnails on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-thumb-set')).toHaveLength(2);
  });

  it('should show corresponding image in carousel and set active class on thumbnail when clicking on thumbnail image', () => {
    fixture.detectChanges();
    (element.getElementsByClassName('product-thumb-set')[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(element.getElementsByClassName('product-thumb-set')[1].getAttribute('class')).toContain('active');
    expect(component.activeSlide).toEqual(1);
  });

  it('should render product image component on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toBeTruthy();
  });
});
