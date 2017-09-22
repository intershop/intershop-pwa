import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { anything, instance, mock, verify } from 'ts-mockito';
import { AccountLoginService } from '../../services/account-login';
import { AccountOverviewComponent } from './account-overview.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let component: AccountOverviewComponent;
  let element: HTMLElement;
  let accountLoginService: AccountLoginService;
  let routerMock: Router;

  beforeEach(async(() => {
    routerMock = mock(Router);
    const accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [AccountOverviewComponent],
      providers: [
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
    accountLoginService = TestBed.get(AccountLoginService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate and change user state when logout is called', () => {
    component.logout();
    verify(routerMock.navigate(anything())).called();
    expect(accountLoginService.isAuthorized()).toBeFalsy();
  });
});
