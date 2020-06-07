import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Product } from 'ish-core/models/product/product.model';

import { LazyProductAddToWishlistComponent } from '../../../extensions/wishlists/exports/product/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { ProductDetailActionsComponent } from './product-detail-actions.component';

describe('Product Detail Actions Component', () => {
  let component: ProductDetailActionsComponent;
  let fixture: ComponentFixture<ProductDetailActionsComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FeatureToggleModule.forTesting('compare'), TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        ProductDetailActionsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailActionsComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    product.availability = true;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('link rendering', () => {
    it(`should show "email to friend" link when product inforamtion is available`, () => {
      translate.set('product.email_a_friend.link', 'Email a friend');
      fixture.detectChanges();
      expect(
        element.querySelector('fa-icon[ng-reflect-icon="fas,paper-plane"]').nextElementSibling.textContent
      ).toContain('Email a friend');
    });

    it(`should show "print page" link when product inforamtion is available`, () => {
      translate.set('product.print_page.link', 'Print Page');
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,print"]').nextElementSibling.textContent).toContain(
        'Print Page'
      );
    });

    it(`should show "compare" link when product inforamtion is available`, () => {
      translate.set('product.compare.link', 'Compare');
      fixture.detectChanges();
      expect(element.querySelector('fa-icon[ng-reflect-icon="fas,columns"]').nextElementSibling.textContent).toContain(
        'Compare'
      );
    });

    it('should not show "compare" link when product inforamtion is available and productMaster = true', () => {
      component.product.type = 'VariationProductMaster';
      fixture.detectChanges();
      expect(element.querySelector("[data-testing-id='compare-sku']")).toBeFalsy();
    });
  });

  it('should emit "product to compare" event when compare link is clicked', () => {
    const eventEmitter$ = spy(component.productToCompare);
    fixture.detectChanges();

    element.querySelector<HTMLElement>("[data-testing-id='compare-sku'] a").click();

    verify(eventEmitter$.emit()).once();
  });
});
