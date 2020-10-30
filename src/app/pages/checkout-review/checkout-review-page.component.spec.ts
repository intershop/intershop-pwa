import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReviewPageComponent } from './checkout-review-page.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';

describe('Checkout Review Page Component', () => {
  let component: CheckoutReviewPageComponent;
  let fixture: ComponentFixture<CheckoutReviewPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewPageComponent,
        MockComponent(CheckoutReviewComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
