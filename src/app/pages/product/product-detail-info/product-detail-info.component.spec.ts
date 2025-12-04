import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductAttachmentsComponent } from 'ish-shared/components/product/product-attachments/product-attachments.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';

import { ProductReviewsComponent } from '../../../extensions/rating/shared/product-reviews/product-reviews.component';

import { ProductDetailInfoComponent } from './product-detail-info.component';

describe('Product Detail Info Component', () => {
  let component: ProductDetailInfoComponent;
  let fixture: ComponentFixture<ProductDetailInfoComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: '123' } as ProductView));
    when(context.select('sku')).thenReturn(of('123'));
    when(context.select('variationCount')).thenReturn(of(0));

    await TestBed.configureTestingModule({
      imports: [ProductDetailInfoComponent, TranslateModule.forRoot()],
      providers: [
        ...(FeatureToggleModule.forTesting('rating').providers ?? []),
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    })
      .overrideComponent(ProductDetailInfoComponent, {
        set: {
          imports: [
            NgbNavModule,
            FeatureToggleDirective,
            MockComponent(ProductReviewsComponent),
            AsyncPipe,
            TranslatePipe,
            MockComponent(ProductAttachmentsComponent),
            MockComponent(ProductAttributesComponent),
            MockDirective(ServerHtmlDirective),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the product description tab with status active', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('.nav-tabs a.nav-link')).toHaveLength(2);
    expect(element.querySelector('.nav-tabs [data-testing-id=product-description-tab].active')).toBeTruthy();
  });

  it('should not display the product rating tab for variation master', () => {
    when(context.select('product')).thenReturn(of({ type: 'VariationProductMaster' }));

    fixture.detectChanges();

    expect(element.querySelectorAll('.nav-tabs a.nav-link')).toHaveLength(1);
    expect(element.querySelectorAll('.nav-tabs [data-testing-id=product-reviews-tab]')).toBeEmpty();
  });
});
