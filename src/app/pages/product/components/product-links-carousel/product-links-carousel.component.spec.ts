import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { ProductLinkView } from 'ish-core/models/product-links/product-links.model';

import { ProductItemContainerComponent } from '../../../../shared/product/containers/product-item/product-item.container';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SwiperModule],
      declarations: [MockComponent(ProductItemContainerComponent), ProductLinksCarouselComponent],
    }).compileComponents();
  }));

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
    expect(element).toMatchSnapshot();
  });
});
