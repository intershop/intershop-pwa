import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { anyFunction, anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalState } from '../../services';
import { AccountLoginService } from '../../services/account-login';
import { AccountOverviewComponent } from './account-overview.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let component: AccountOverviewComponent;
  let element: HTMLElement;
  let globalStateMock: GlobalState;
  let accountLoginServiceMock: AccountLoginService;
  let routerMock: Router;
  const userData = { firstName: 'Patricia', userName: 'Miller' };

  beforeEach(async(() => {
    globalStateMock = mock(GlobalState);
    when(globalStateMock.subscribeCachedData(anyString(), anyFunction())).thenCall((arg1: string, arg2: Function) => {
      return arg2(userData);
    });
    routerMock = mock(Router);
    accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [AccountOverviewComponent],
      providers: [
        {
          provide: GlobalState,
          useFactory: () => instance(globalStateMock)
        },
        {
          provide: AccountLoginService,
          useFactory: () => instance(accountLoginServiceMock)
        },
        {
          provide: Router,
          useFactory: () => instance(routerMock)
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call Category Service when cache not available', () => {
    verify(globalStateMock.subscribeCachedData(anyString(), anyFunction())).called();
    expect(component.customerName).toEqual('Patricia');
  });

  it('should call logout method and verify if router.navigate and notifyDataChanged are called', () => {
    component.logout();
    verify(globalStateMock.notifyDataChanged(anyString(), anything())).called();
    verify(routerMock.navigate(anything())).called();
  });
});
