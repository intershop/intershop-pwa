import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { SwiperComponent } from 'swiper/angular';
import { instance, mock } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductItemComponent),
        MockComponent(SwiperComponent),
        MockDirective(ProductContextDirective),
        ProductLinksCarouselComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { products: ['sku'], categories: ['catID'] } as ProductLinks;

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
  });
});
