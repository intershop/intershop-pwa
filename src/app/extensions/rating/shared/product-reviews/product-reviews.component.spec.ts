import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';
import { ProductRatingStarComponent } from '../product-rating-star/product-rating-star.component';
import { ProductReviewCreateDialogComponent } from '../product-review-create-dialog/product-review-create-dialog.component';

import { ProductReviewsComponent } from './product-reviews.component';

describe('Product Reviews Component', () => {
  let component: ProductReviewsComponent;
  let fixture: ComponentFixture<ProductReviewsComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let reviewsFacade: ProductReviewsFacade;
  let accountFacade: AccountFacade;

  const review: ProductReview = {
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
    reviewsFacade = mock(ProductReviewsFacade);
    accountFacade = mock(AccountFacade);
    when(context.select('sku')).thenReturn(of('sku1'));
    when(reviewsFacade.getProductReviews$(anything())).thenReturn(of([review]));
    when(reviewsFacade.deleteProductReview(anything(), anything())).thenReturn(undefined);
    when(accountFacade.isLoggedIn$).thenReturn(of(true));

    await TestBed.configureTestingModule({
      imports: [RoleToggleModule.forTesting(), RouterTestingModule],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductRatingStarComponent),
        MockComponent(ProductReviewCreateDialogComponent),
        MockPipe(DatePipe),
        MockPipe(TranslatePipe),
        ProductReviewsComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductReviewsFacade, useFactory: () => instance(reviewsFacade) },
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
    when(reviewsFacade.productReviewsError$).thenReturn(of({ message: 'error' } as HttpError));
    expect(element.getElementsByTagName('ish-error-message')).toBeTruthy();
  });

  it('should render title of review', () => {
    fixture.detectChanges();
    expect(element.querySelector('.review-item-header-title').textContent).toContain('Nice');
  });

  it('should render author review', () => {
    fixture.detectChanges();
    expect(element.querySelector('.review-item-text').textContent).toBe(
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr'
    );
  });

  it('should render login link if the user is not logged in', () => {
    when(accountFacade.isLoggedIn$).thenReturn(of(false));

    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=open-review-dialog]')).toBeFalsy();
  });

  it('should render open dialog link if the user is logged in', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=open-review-dialog]')).toBeTruthy();
  });

  it('should trigger deleteReview facade method if the deleteReview is called', () => {
    when(context.get('sku')).thenReturn('123');

    component.deleteReview(review);

    verify(reviewsFacade.deleteProductReview('123', review)).once();
  });
});
