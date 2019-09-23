import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { CheckoutReviewPageContainerComponent } from './checkout-review-page.container';
import { CheckoutReviewComponent } from './components/checkout-review/checkout-review.component';

describe('Checkout Review Page Container', () => {
  let component: CheckoutReviewPageContainerComponent;
  let fixture: ComponentFixture<CheckoutReviewPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewPageContainerComponent,
        MockComponent(CheckoutReviewComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
