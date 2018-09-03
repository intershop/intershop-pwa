import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { coreReducers } from '../../../core/store/core.system';
import { MockComponent } from '../../../utils/dev/mock.component';

import { OrderPageContainerComponent } from './order-page.container';

describe('Order Page Container', () => {
  let component: OrderPageContainerComponent;
  let fixture: ComponentFixture<OrderPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
        }),
      ],
      declarations: [
        OrderPageContainerComponent,
        MockComponent({
          selector: 'ish-order-page',
          template: 'Account Order Detail Page Component',
          inputs: ['order'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
