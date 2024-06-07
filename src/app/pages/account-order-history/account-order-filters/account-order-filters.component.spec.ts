import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { AccountOrderFiltersComponent } from './account-order-filters.component';

const roles = [
  {
    roleId: 'APP_B2B_ACCOUNT_OWNER',
    displayName: 'Blubber',
  },
];

describe('Account Order Filters Component', () => {
  let component: AccountOrderFiltersComponent;
  let fixture: ComponentFixture<AccountOrderFiltersComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [
        MockComponent(FormlyForm),
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [AccountOrderFiltersComponent, MockComponent(FaIconComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderFiltersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(accountFacade.roles$).thenReturn(of(roles));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
