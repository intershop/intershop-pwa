import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductImageComponent } from './product-image.component';

describe('Product Image Component', () => {
  let component: ProductImageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ProductImageComponent>;
  let translate: TranslateService;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.getProductImage$(anything(), anything())).thenReturn(EMPTY);
    when(context.select('product')).thenReturn(of({} as ProductView));
    when(context.select('productURL')).thenReturn(of('/product/TEST'));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [ProductImageComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('product.image.text.alttext', 'product photo');

    component.showImage$.next();
    component.imageType = 'S';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render N/A image when images is not available', () => {
    when(context.getProductImage$(anything(), anything())).thenReturn(of(undefined));

    fixture.detectChanges();
    expect(element.querySelector('img')?.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "alt": " product photo",
        "class": "product-image",
        "itemprop": "image",
        "src": "/assets/img/not_available.png",
      }
    `);
  });

  it('should render img tag when image is available', () => {
    when(context.getProductImage$(anything(), anything())).thenReturn(
      of({
        name: 'front S',
        type: 'Image',
        imageActualHeight: 110,
        imageActualWidth: 110,
        viewID: 'front',
        effectiveUrl: '/assets/product_img/a.jpg',
        typeID: 'S',
        primaryImage: true,
      })
    );

    fixture.detectChanges();
    expect(element.querySelector('img')?.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "alt": " product photo",
        "class": "product-image",
        "data-type": "S",
        "data-view": "front",
        "height": "110",
        "itemprop": "image",
        "src": "/assets/product_img/a.jpg",
        "width": "110",
      }
    `);
  });

  it('should render N/A image when image source is not available', () => {
    when(context.getProductImage$(anything(), anything())).thenReturn(
      of({
        name: 'front S',
        type: 'Image',
        imageActualHeight: 110,
        imageActualWidth: 110,
        viewID: 'front',
        effectiveUrl: '',
        typeID: 'S',
        primaryImage: true,
      })
    );

    fixture.detectChanges();
    expect(element.querySelector('img').getAttribute('src')).toBe('/assets/img/not_available.png');
  });

  describe('image alt attribute', () => {
    it('should render if altText set as input parameter', () => {
      component.altText = 'test';
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('test');
    });

    it('should render default text if product information is still undefined', () => {
      when(context.select('product')).thenReturn(of(undefined));
      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe(' product photo');
    });

    it('should show product name when product name available', () => {
      when(context.select('product')).thenReturn(of({ name: 'Lenco', sku: '1234' } as ProductView));

      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('Lenco product photo');
    });

    it('should show product sku when product name not available', () => {
      when(context.select('product')).thenReturn(of({ sku: '1234' } as ProductView));

      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toBe('1234 product photo');
    });

    it('should append imageView when image view is available and altText parameter not set', () => {
      component.imageView = 'front';

      fixture.detectChanges();
      expect(element.querySelector('img').getAttribute('alt')).toContain('front S');
    });
  });

  describe('link creation', () => {
    it('should generate a link around the component if requested', () => {
      component.link = true;
      fixture.detectChanges();

      expect(element.querySelector('a').href).toMatchInlineSnapshot(`"http://localhost/product/TEST"`);
    });
  });
});
