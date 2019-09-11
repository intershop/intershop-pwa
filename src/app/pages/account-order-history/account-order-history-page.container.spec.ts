import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountOrderHistoryPageContainerComponent } from './account-order-history-page.container';
import { AccountOrderHistoryPageComponent } from './components/account-order-history-page/account-order-history-page.component';

describe('Account Order History Page Container', () => {
  let component: AccountOrderHistoryPageContainerComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageContainerComponent,
        MockComponent(AccountOrderHistoryPageComponent),
        MockComponent(LoadingComponent),
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
