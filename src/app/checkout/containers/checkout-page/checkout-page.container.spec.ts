import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { instance, mock } from 'ts-mockito';
import { MockComponent } from '../../../utils/dev/mock.component';
import { CheckoutPageContainerComponent } from './checkout-page.container';

describe('Checkout Page Container', () => {
  let fixture: ComponentFixture<CheckoutPageContainerComponent>;
  let component: CheckoutPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutPageContainerComponent,
        MockComponent({ selector: 'ish-checkout-progress-bar', inputs: ['step'], template: 'Checkout Progress Bar' }),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) },
        { provide: ActivatedRoute, useValue: { firstChild: { data: EMPTY } } },
      ],
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
