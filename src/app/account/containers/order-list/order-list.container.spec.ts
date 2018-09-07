import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { PipesModule } from '../../../shared/pipes.module';
import { MockComponent } from '../../../utils/dev/mock.component';

import { OrderListContainerComponent } from './order-list.container';

describe('Order List Container', () => {
  let component: OrderListContainerComponent;
  let fixture: ComponentFixture<OrderListContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderListContainerComponent,
        MockComponent({
          selector: 'ish-order-list',
          template: 'Order List Component',
          inputs: ['orders', 'maxListItems', 'compact'],
        }),
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
      ],
      imports: [PipesModule],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeTruthy();
  });
});
