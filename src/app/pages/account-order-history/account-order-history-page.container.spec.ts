import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from '../../utils/dev/mock.component';

import { AccountOrderHistoryPageContainerComponent } from './account-order-history-page.container';

describe('Account Order History Page Container', () => {
  let component: AccountOrderHistoryPageContainerComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageContainerComponent,
        MockComponent({
          selector: 'ish-account-order-history-page',
          template: 'Order History Page Component',
          inputs: ['orders'],
        }),
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading Component',
        }),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderHistoryPageContainerComponent);
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
    expect(element.querySelector('ish-account-order-history-page')).toBeTruthy();
  });
});
