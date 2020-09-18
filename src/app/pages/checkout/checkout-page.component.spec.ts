import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { CheckoutPageComponent } from './checkout-page.component';
import { CheckoutProgressBarComponent } from './checkout-progress-bar/checkout-progress-bar.component';

describe('Checkout Page Component', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutPageComponent, MockComponent(CheckoutProgressBarComponent)],
      imports: [RouterTestingModule],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
