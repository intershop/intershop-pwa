import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { FieldLibrary } from 'ish-shared/formly/field-library/field-library';

import { OrganizationSettingsCompanyComponent } from './organization-settings-company.component';

describe('Organization Settings Company Component', () => {
  let component: OrganizationSettingsCompanyComponent;
  let fixture: ComponentFixture<OrganizationSettingsCompanyComponent>;
  let element: HTMLElement;
  let fieldLibrary: FieldLibrary;

  beforeEach(async () => {
    fieldLibrary = mock(FieldLibrary);
    when(fieldLibrary.getConfigurationGroup(anything(), anything())).thenReturn([
      {
        key: 'companyName',
        props: {
          required: true,
        },
      },
      {
        key: 'companyName2',
      },
      {
        key: 'taxationID',
      },
    ]);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ErrorMessageComponent), OrganizationSettingsCompanyComponent],
      providers: [{ provide: FieldLibrary, useFactory: () => instance(fieldLibrary) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSettingsCompanyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for companyName, companyName2 and taxationID', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(3);
  });

  it('should emit updateCompanyProfile event if form is valid', () => {
    const eventEmitter$ = spy(component.updateCompanyProfile);

    component.currentCustomer = { customerNo: '4711', isBusinessCustomer: true, companyName: 'OilCorp' } as Customer;
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateCompanyProfile event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateCompanyProfile);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.buttonDisabled).toBeFalse();
    component.submit();
    expect(component.buttonDisabled).toBeTrue();
  });
});
