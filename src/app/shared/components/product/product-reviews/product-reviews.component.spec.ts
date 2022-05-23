import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductReview } from 'ish-core/models/product-reviews/product-review.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ProductRatingStarComponent } from 'ish-shared/components/product/product-rating-star/product-rating-star.component';

import { ProductReviewsComponent } from './product-reviews.component';

describe('Product Reviews Component', () => {
  let component: ProductReviewsComponent;
  let fixture: ComponentFixture<ProductReviewsComponent>;
  let element: HTMLElement;
  let review: ProductReview;
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  review = {
    id: '1',
    authorFirstName: 'Foo',
    authorLastName: 'Bar',
    title: 'Nice',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
    creationDate: 1652874276878,
    rating: 4,
    showAuthorNameFlag: true,
    localeID: '347',
  };

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    shoppingFacade = mock(ShoppingFacade);
    when(context.select('product', 'roundedAverageRating')).thenReturn(of(5));
    when(context.select('reviews')).thenReturn(of([review]));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(ProductRatingStarComponent),
        MockPipe(DatePipe),
        MockPipe(TranslatePipe),
        ProductReviewsComponent,
      ],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReviewsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product review when available', () => {
    fixture.detectChanges();
    expect(element.getElementsByClassName('row')).toHaveLength(1);
  });

  it('should render author first name', () => {
    fixture.detectChanges();
    expect(element.querySelector('.review-item-created').textContent).toContain('Foo');
  });

  it('should render rating stars', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-product-rating-star')).toBeTruthy();
  });

  it('should render error message if reviews could not be loaded', () => {
    fixture.detectChanges();
    when(context.select('reviews')).thenThrow(new Error('error'));
    expect(element.getElementsByTagName('ish-error-message')).toBeTruthy();
  });

  it('should render title of review', () => {
    fixture.detectChanges();
    expect(element.querySelector('.review-item-header-title').textContent).toBe('Nice');
  });

  it('should render author review', () => {
    fixture.detectChanges();
    expect(element.querySelector('.review-item-text').textContent).toBe(
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr'
    );
  });
});
