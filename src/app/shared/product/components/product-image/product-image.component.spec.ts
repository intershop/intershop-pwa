import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Product } from '../../../../models/product/product.model';
import { ProductImageComponent } from './product-image.component';

describe('Product Image Component', () => {
  let component: ProductImageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ProductImageComponent>;
  let product: Product;
  let translate: TranslateService;
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
    ];
    TestBed.configureTestingModule({
      declarations: [ProductImageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ICM_BASE_URL, useValue: '' }],
    }).compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('product.image.text.alttext', 'product photo');
    fixture = TestBed.createComponent(ProductImageComponent);
    component = fixture.componentInstance;
    component.imageType = 'S';
    component.product = product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render N/A image when images is not available', () => {
    component.product.images = [];
    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('src')).toBe('/assets/img/not_available.png');
  });

  it('should render img tag when imageView is not available', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('data-type')).toBe(component.imageType);
  });

  it('should render img tag for S size and for image view front', () => {
    component.imageType = 'S';
    component.imageView = 'front';
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('data-type')).toBe(component.imageType);
  });

  it('should render img tag for L size and for image view front', () => {
    component.imageType = 'L';
    component.imageView = 'front';
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('data-type')).toBe(component.imageType);
  });

  it('should render N/A image when image source is not available', () => {
    product.images = [
      {
        name: 'front S',
        type: 'Image',
        imageActualHeight: 110,
        imageActualWidth: 110,
        viewID: 'front',
        effectiveUrl: '',
        typeID: 'S',
        primaryImage: true,
      },
    ];
    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('src')).toBe('/assets/img/not_available.png');
  });

  describe('image alt attibute', () => {
    it('should render if altText set as input parameter', () => {
      component.altText = 'test';
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('test');
    });

    it('should show product name when product name available', () => {
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('Lenco product photo');
    });

    it('should show product sku when product name not available', () => {
      product.name = null;
      product.sku = '1234';
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('1234 product photo');
    });

    it('should append imageView when image view is available and altText parameter not set', () => {
      component.imageView = 'front';
      component.ngOnChanges();
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toContain('front S');
    });
  });
});
