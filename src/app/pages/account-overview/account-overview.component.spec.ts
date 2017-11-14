import { Location } from '@angular/common';
import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { AccountOverviewComponent } from './account-overview.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let component: AccountOverviewComponent;
  let element: HTMLElement;
  let accountLoginService: AccountLoginService;
  let location: Location;

  beforeEach(async(() => {
    const accountLoginServiceMock = mock(AccountLoginService);

    TestBed.configureTestingModule({
      declarations: [AccountOverviewComponent],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: AccountOverviewComponent }
        ])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    accountLoginService = TestBed.get(AccountLoginService);
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage when user logs out', async(() => {
    expect(location.path()).toBe('');
    component.logout();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/home');
      expect(accountLoginService.isAuthorized()).toBeFalsy();
    });
  }));
});
