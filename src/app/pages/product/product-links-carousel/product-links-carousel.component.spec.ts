import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductLinkView } from 'ish-core/models/product-links/product-links.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperModule],
      declarations: [
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
        ProductLinksCarouselComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { productSKUs: ['sku'], categoryIds: ['catID'] } as ProductLinkView;

    fixture = TestBed.createComponent(ProductLinksCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('swiper')).toBeTruthy();
    expect(element.querySelector('swiper .swiper-slide')).toMatchInlineSnapshot(`
      <div class="swiper-slide">
        <ish-product-item ishproductcontext="" ng-reflect-sku="sku"></ish-product-item>
      </div>
    `);
  });
});
