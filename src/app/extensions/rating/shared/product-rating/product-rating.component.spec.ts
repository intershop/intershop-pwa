import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductRatingComponent } from './product-rating.component';

describe('Product Rating Component', () => {
  let component: ProductRatingComponent;
  let fixture: ComponentFixture<ProductRatingComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product', 'roundedAverageRating')).thenReturn(of(3.5));
    when(context.select('product', 'numberOfReviews')).thenReturn(of(2));
    when(context.select('product')).thenReturn(of({ type: 'Product' }));

    await TestBed.configureTestingModule({
      imports: [NgbModule, TranslatePipe],
      declarations: [ProductRatingComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }, provideTranslateService()],
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

  it('should display rating as text', () => {
    fixture.detectChanges();

    expect(element?.getElementsByClassName('product-info')[0].textContent).toMatchInlineSnapshot(`"(2)"`);
  });

  it('should display rating stars for rating', () => {
    fixture.detectChanges();

    const rating = element.querySelector('ngb-rating');
    expect(rating).toBeTruthy();
    const ngbRatingDirective = fixture.debugElement.query(By.directive(NgbRating));
    expect(ngbRatingDirective.componentInstance.rate).toBe(3.5);
  });

  it('should hide review count when hideNumberOfReviews is true', () => {
    component.hideNumberOfReviews = true;
    fixture.detectChanges();

    expect(element.querySelector('.product-info')).toBeFalsy();
  });

  it('should not render for variation master products', () => {
    when(context.select('product')).thenReturn(of({ type: 'VariationProductMaster' }));
    fixture.detectChanges();

    expect(element.querySelector('ngb-rating')).toBeFalsy();
  });

  it('should render with rate 0 when no rating is available', () => {
    when(context.select('product', 'roundedAverageRating')).thenReturn(of(undefined));
    fixture.detectChanges();

    const rating = element.querySelector('ngb-rating');
    expect(rating).toBeTruthy();

    const ngbRatingDirective = fixture.debugElement.query(By.directive(NgbRating));
    expect(ngbRatingDirective.componentInstance.rate).toBe(0);
  });
});
