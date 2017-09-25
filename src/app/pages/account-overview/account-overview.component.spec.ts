import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { AccountLoginService } from '../../services/account-login';
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
    const router = TestBed.get(LocalizeRouterService);
    this.navSpy = spyOn(router, 'navigateToRoute');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate and change user state when logout is called', () => {
    component.logout();
    expect(this.navSpy).toHaveBeenCalled();
    expect(accountLoginService.isAuthorized()).toBeFalsy();
  });
});
