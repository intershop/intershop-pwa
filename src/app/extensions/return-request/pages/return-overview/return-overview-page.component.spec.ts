import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnOverviewPageComponent } from './return-overview-page.component';

describe('Return Overview Page Component', () => {
  let component: ReturnOverviewPageComponent;
  let fixture: ComponentFixture<ReturnOverviewPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.orders$).thenReturn(of([]));
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        ReturnOverviewPageComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ReturnRequestFacade, useFactory: () => instance(mock(ReturnRequestFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnOverviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
