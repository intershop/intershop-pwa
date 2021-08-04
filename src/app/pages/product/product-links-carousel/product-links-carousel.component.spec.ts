import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { SwiperComponent, SwiperSlideDirective } from 'swiper/angular';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
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
        MockDirective(ProductContextDirective),
        ProductLinksCarouselComponent,
        SwiperComponent,
        SwiperSlideDirective,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { products: ['sku1', 'sku2', 'sku3'], categories: ['catID'] } as ProductLinks;

    fixture = TestBed.createComponent(ProductLinksCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('swiper')).toBeTruthy();
  });

  it('should render all product slides if stocks filtering is off', () => {
    component.displayOnlyAvailableProducts = false;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('.swiper-slide')).toHaveLength(3);
  });

  it('should render only available product slides if stocks filtering is on', () => {
    when(shoppingFacade.product$(anything(), anything())).thenCall(sku =>
      of({ sku, available: sku !== 'sku2' } as ProductView)
    );

    component.displayOnlyAvailableProducts = true;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('.swiper-slide')).toHaveLength(2);
  });
});
