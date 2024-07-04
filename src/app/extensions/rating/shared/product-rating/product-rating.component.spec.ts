import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductRatingStarComponent } from '../product-rating-star/product-rating-star.component';

import { ProductRatingComponent } from './product-rating.component';

describe('Product Rating Component', () => {
  let component: ProductRatingComponent;
  let fixture: ComponentFixture<ProductRatingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('product', 'roundedAverageRating')).thenReturn(of(3.5));
    when(context.select('product', 'numberOfReviews')).thenReturn(of(2));
    when(context.select('product')).thenReturn(of({ type: 'Product' }));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(ProductRatingStarComponent), ProductRatingComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRatingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always display rating as text', () => {
    fixture.detectChanges();

    expect(element?.textContent).toMatchInlineSnapshot(`"(2)"`);
  });

  it('should display rating stars for rating', () => {
    fixture.detectChanges();

    const stars = fixture.debugElement
      .queryAll(By.css('ish-product-rating-star'))
      .map(cmp => (cmp.componentInstance as ProductRatingStarComponent).filled);
    expect(stars).toMatchInlineSnapshot(`
      [
        "full",
        "full",
        "full",
        "half",
        "empty",
      ]
    `);
  });
});
