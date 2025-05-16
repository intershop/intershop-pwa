import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { AccountOrderFiltersComponent } from './account-order-filters.component';

describe('Account Order Filters Component', () => {
  let component: AccountOrderFiltersComponent;
  let fixture: ComponentFixture<AccountOrderFiltersComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    when(accountFacade.isOrderManager$).thenReturn(of(true));
    when(accountFacade.isLoggedIn$).thenReturn(of(true));
    await TestBed.configureTestingModule({
      imports: [
        MockComponent(FaIconComponent),
        MockComponent(FormlyForm),
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      declarations: [AccountOrderFiltersComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderFiltersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
