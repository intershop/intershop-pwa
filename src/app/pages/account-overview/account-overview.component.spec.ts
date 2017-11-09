import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { anything, instance, mock, verify } from 'ts-mockito';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { AccountOverviewComponent } from './account-overview.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let component: AccountOverviewComponent;
  let element: HTMLElement;
  let accountLoginService: AccountLoginService;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(async(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);
    const accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [AccountOverviewComponent],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    accountLoginService = TestBed.get(AccountLoginService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage when user logs out', () => {
    component.logout();
    // check if it was called
    verify(localizeRouterServiceMock.navigateToRoute(anything())).once();
    expect(accountLoginService.isAuthorized()).toBeFalsy();
  });
});
