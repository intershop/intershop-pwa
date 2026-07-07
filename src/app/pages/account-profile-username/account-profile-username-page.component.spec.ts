import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { AccountProfileUsernamePageComponent } from './account-profile-username-page.component';
import { AccountProfileUsernameComponent } from './account-profile-username/account-profile-username.component';

describe('Account Profile Username Page Component', () => {
  let component: AccountProfileUsernamePageComponent;
  let fixture: ComponentFixture<AccountProfileUsernamePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountProfileUsernamePageComponent, MockComponent(AccountProfileUsernameComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileUsernamePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
