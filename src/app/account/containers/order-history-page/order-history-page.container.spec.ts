import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from '../../../utils/dev/mock.component';
import { OrderHistoryPageContainerComponent } from './order-history-page.container';

describe('Order History Page Container', () => {
  let component: OrderHistoryPageContainerComponent;
  let fixture: ComponentFixture<OrderHistoryPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderHistoryPageContainerComponent,
        MockComponent({
          selector: 'ish-order-history-page',
          template: 'Order History Page Component',
        }),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
