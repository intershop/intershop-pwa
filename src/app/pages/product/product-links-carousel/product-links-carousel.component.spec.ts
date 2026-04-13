import { AsyncPipe } from '@angular/common';
import { Component, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { forkJoin, of, switchMap } from 'rxjs';
import { SwiperModule } from 'swiper/angular';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

/* eslint-disable @angular-eslint/directive-selector, @angular-eslint/component-selector, ish-custom-rules/newline-before-root-members */
@Directive({
  selector: '[swiperSlide]',
  standalone: true,
})
class MockSwiperSlideDirective {
  constructor(templateRef: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    viewContainerRef.createEmbeddedView(templateRef, { $implicit: { isVisible: true } });
  }
}

@Component({
  selector: 'swiper',
  template: '<ng-content />',
  standalone: true,
  imports: [MockSwiperSlideDirective],
})
class MockSwiperComponent {
  @Input() config: unknown;
}
/* eslint-enable @angular-eslint/directive-selector, @angular-eslint/component-selector, ish-custom-rules/newline-before-root-members */

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [ProductLinksCarouselComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    })
      .overrideComponent(ProductLinksCarouselComponent, {
        remove: {
          imports: [AsyncPipe, ProductContextDirective, ProductItemComponent, SwiperModule],
        },
        add: {
          imports: [
            AsyncPipe,
            MockDirective(ProductContextDirective),
            MockComponent(ProductItemComponent),
            MockSwiperComponent,
          ],
        },
      })
      .compileComponents();
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
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('swiper')).toBeTruthy();
  });

  it('should render all product slides if stocks filtering is off', done => {
    component.displayOnlyAvailableProducts = false;

    component.productSKUs$.pipe(switchMap(products$ => forkJoin(products$))).subscribe(products => {
      expect(products).toHaveLength(3);
      done();
    });
  });

  it('should render only available product slides if stocks filtering is on', done => {
    when(shoppingFacade.product$(anything(), anything())).thenCall(sku => of({ sku } as ProductView));
    when(shoppingFacade.productInventory$(anything())).thenCall(sku =>
      of({ sku, inStock: sku !== 'sku2' } as ProductInventory)
    );

    component.displayOnlyAvailableProducts = true;

    component.productSKUs$.pipe(switchMap(products$ => forkJoin(products$))).subscribe(products => {
      expect(products).toHaveLength(2);
      done();
    });
  });
});
