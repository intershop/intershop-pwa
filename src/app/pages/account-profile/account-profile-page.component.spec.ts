import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';

describe('Account Profile Page Component', () => {
  let component: AccountProfilePageComponent;
  let fixture: ComponentFixture<AccountProfilePageComponent>;
  let element: HTMLElement;

  const user = {
    firstName: 'Patricia',
    lastName: 'Miller',
    title: '',
  } as User;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(of(user));

    await TestBed.configureTestingModule({
      declarations: [AccountProfilePageComponent, MockComponent(AccountProfileComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
