import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { OrderListComponent } from 'ish-shared/components/order/order-list/order-list.component';

import { OrderWidgetComponent } from './order-widget.component';

describe('Order Widget Component', () => {
  let component: OrderWidgetComponent;
  let fixture: ComponentFixture<OrderWidgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderWidgetComponent, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }, provideRouter([])],
    })
      .overrideComponent(OrderWidgetComponent, {
        remove: { imports: [InfoBoxComponent, OrderListComponent] },
        add: { imports: [MockComponent(InfoBoxComponent), MockComponent(OrderListComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
