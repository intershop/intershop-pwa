import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

import { AccountUserInfoComponent } from './account-user-info.component';

describe('Account User Info Component', () => {
  let component: AccountUserInfoComponent;
  let fixture: ComponentFixture<AccountUserInfoComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.customer$).thenReturn(EMPTY);
    when(accountFacade.roles$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [AccountUserInfoComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUserInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render when user is private customer', () => {
    when(accountFacade.customer$).thenReturn(of({ isBusinessCustomer: false } as Customer));

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render when user is business customer', () => {
    when(accountFacade.customer$).thenReturn(of({ isBusinessCustomer: true, companyName: 'Foods Inc.' } as Customer));
    when(accountFacade.user$).thenReturn(of({ firstName: 'Max', lastName: 'Mustermann' } as User));
    when(accountFacade.roles$).thenReturn(
      of([
        { displayName: 'Approver', roleId: 'APP_B2B_APPROVER' },
        { displayName: 'Buyer', roleId: 'APP_B2B_BUYER' },
      ])
    );

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <li class="account-welcome">
        <h4>Mustermann, Max</h4>
        <p><small>Foods Inc.</small></p>
        <p><small>Approver, Buyer</small></p>
      </li>
    `);
  });

  it('should display email when user has no name', () => {
    when(accountFacade.customer$).thenReturn(of({ isBusinessCustomer: true, companyName: 'Foods Inc.' } as Customer));
    when(accountFacade.user$).thenReturn(of({ login: 'max.mustermann@test.de' } as User));
    when(accountFacade.roles$).thenReturn(EMPTY);

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <li class="account-welcome">
        <h4 class="ellipsis">max.mustermann@test.de</h4>
        <p><small>Foods Inc.</small></p>
      </li>
    `);
  });
});
