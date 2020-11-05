import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

import { AccountOverviewPageComponent } from './account-overview-page.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';

describe('Account Overview Page Component', () => {
  let fixture: ComponentFixture<AccountOverviewPageComponent>;
  let component: AccountOverviewPageComponent;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;

  beforeEach(async () => {
    accountFacadeMock = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [AccountOverviewPageComponent, MockComponent(AccountOverviewComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account overview component on page', () => {
    when(accountFacadeMock.user$).thenReturn(of({ firstName: 'Patricia' } as User));
    fixture.detectChanges();

    expect(element.querySelector('ish-account-overview')).toBeTruthy();
  });
});
