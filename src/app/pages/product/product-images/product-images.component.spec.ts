import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { SwiperModule } from 'swiper/angular';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';

import { ProductImagesComponent } from './product-images.component';

describe('Product Images Component', () => {
  let component: ProductImagesComponent;
  let fixture: ComponentFixture<ProductImagesComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(
      of({
        sku: 'sku',
        name: 'Lenco',
        images: [
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
        ],
      } as ProductView)
    );
    await TestBed.configureTestingModule({
      imports: [SwiperModule],
      declarations: [
        MockComponent(ProductImageComponent),
        MockComponent(ProductLabelComponent),
        ProductImagesComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.activeSlide = 0;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render carousel on component', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('swiper-slide')).toHaveLength(2);
  });

  it('should render thumbnails on component', () => {
    fixture.detectChanges();
    const thumbNailsSetElement = fixture.debugElement.queryAll(By.css('.product-thumb-set'));
    expect(thumbNailsSetElement).toHaveLength(2);
    const productImageElem = thumbNailsSetElement[0].query(By.css('ish-product-image'))
      ?.componentInstance as ProductImageComponent;
    expect(productImageElem.imageType).toMatchInlineSnapshot(`"S"`);
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

  it('should render product image unavailable on component', () => {
    when(context.select('product')).thenReturn(
      of({
        sku: 'sku',
        name: 'Lenco',
        images: [],
      } as ProductView)
    );

    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-image')).toHaveLength(2);
  });
});
