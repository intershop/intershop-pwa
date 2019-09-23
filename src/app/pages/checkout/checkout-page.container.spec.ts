import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CheckoutPageContainerComponent } from './checkout-page.container';
import { CheckoutProgressBarComponent } from './components/checkout-progress-bar/checkout-progress-bar.component';

describe('Checkout Page Container', () => {
  let fixture: ComponentFixture<CheckoutPageContainerComponent>;
  let component: CheckoutPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutPageContainerComponent, MockComponent(CheckoutProgressBarComponent)],
      imports: [RouterTestingModule, ngrxTesting({ reducers: { checkout: combineReducers(checkoutReducers) } })],
      providers: [{ provide: ActivatedRoute, useValue: { firstChild: { data: EMPTY } } }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
