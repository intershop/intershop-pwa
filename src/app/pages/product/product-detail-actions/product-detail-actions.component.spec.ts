import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';

import { LazyProductAddToWishlistComponent } from '../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { ProductDetailActionsComponent } from './product-detail-actions.component';

describe('Product Detail Actions Component', () => {
  let component: ProductDetailActionsComponent;
  let fixture: ComponentFixture<ProductDetailActionsComponent>;
  let translate: TranslateService;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare'), TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        ProductDetailActionsComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailActionsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');

    const product = { sku: 'sku', available: true } as Product;
    when(context.select('product')).thenReturn(of(createProductView(product)));
    when(context.select('displayProperties', anyString())).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('link rendering', () => {
    it(`should show "email to friend" link when product information is available`, () => {
      translate.set('product.email_a_friend.link', 'Email a friend');
      fixture.detectChanges();
      expect(
        element.querySelector('fa-icon[ng-reflect-icon="fas,paper-plane"]').nextElementSibling.textContent
      ).toContain('Email a friend');
    });

    it(`should show "print page" link when product information is available`, () => {
      translate.set('product.print_page.link', 'Print Page');
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,print"]').nextElementSibling.textContent).toContain(
        'Print Page'
      );
    });

    it(`should show "compare" link when product information is available`, () => {
      translate.set('product.compare.link', 'Compare');
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,columns"]').nextElementSibling.textContent).toContain(
        'Compare'
      );
    });

    it('should not show "compare" link when product information is available and productMaster = true', () => {
      when(context.select('product')).thenReturn(
        of(createProductView({ sku: 'SKU', type: 'VariationProductMaster' } as Product))
      );
      fixture.detectChanges();

      expect(element.querySelector("[data-testing-id='compare-sku']")).toBeFalsy();
    });
  });

  it('should emit "product to compare" event when compare link is clicked', () => {
    fixture.detectChanges();

    element.querySelector<HTMLElement>("[data-testing-id='compare-sku'] a").click();

    verify(context.addToCompare()).once();
  });
});
