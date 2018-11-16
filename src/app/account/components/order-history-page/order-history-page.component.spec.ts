import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MockComponent } from '../../../utils/dev/mock.component';

import { OrderHistoryPageComponent } from './order-history-page.component';

describe('Order History Page Component', () => {
  let component: OrderHistoryPageComponent;
  let fixture: ComponentFixture<OrderHistoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-order-list-container',
          template: 'Order List Container Component',
        }),
        OrderHistoryPageComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on component', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list-container')).toBeTruthy();
  });
});
