import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';

import { OrganizationSettingsPageComponent } from './organization-settings-page.component';

describe('Organization Settings Page Component', () => {
  let component: OrganizationSettingsPageComponent;
  let fixture: ComponentFixture<OrganizationSettingsPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let fieldLibrary: FieldLibrary;

  const customer = { customerNo: 'KlausiCompany', isBusinessCustomer: true, budgetPriceType: 'net' } as Customer;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    fieldLibrary = mock(FieldLibrary);

    when(fieldLibrary.getConfiguration('budgetPriceType')).thenReturn({
      key: 'budgetPriceType',
    });
    when(accountFacade.customer$).thenReturn(of(customer));

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockDirective(AuthorizationToggleDirective),
        MockDirective(ServerHtmlDirective),
        OrganizationSettingsPageComponent,
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: FieldLibrary, useFactory: () => instance(fieldLibrary) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSettingsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 1 input field for budgetPriceType', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(1);
  });
});
