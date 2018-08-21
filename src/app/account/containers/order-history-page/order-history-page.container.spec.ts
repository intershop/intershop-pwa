import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

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
          selector: 'ish-order-list',
          template: 'Order List Component',
        }),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
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
