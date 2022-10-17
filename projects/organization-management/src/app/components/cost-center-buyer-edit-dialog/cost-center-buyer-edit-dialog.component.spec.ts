import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterBuyerEditDialogComponent } from './cost-center-buyer-edit-dialog.component';

describe('Cost Center Buyer Edit Dialog Component', () => {
  let component: CostCenterBuyerEditDialogComponent;
  let fixture: ComponentFixture<CostCenterBuyerEditDialogComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: UntypedFormBuilder;
  let form: UntypedFormGroup;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    organizationManagementFacade = mock(organizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterBuyerEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(UntypedFormBuilder);

    form = fb.group({
      login: ['jlink@test.intershop.de'],
      firstName: ['Jack'],
      lastName: ['Link'],
      budgetValue: [123, [SpecialValidators.moneyAmount]],
      budgetPeriod: ['monthly'],
    });

    component.costCenterBuyerForm = form;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not submit a form when the user does not provide money format for budget', () => {
    component.costCenterBuyerForm = fb.group({
      budgetValue: ['abc', [SpecialValidators.moneyAmount]],
    });

    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitCostCenterBuyerForm();

    expect(component.formDisabled).toBeTrue();
  });

  it('should display all form input fields for cost center buyer update', () => {
    fixture.detectChanges();

    expect(JSON.stringify(component.fields)).toContain('buyerName');
    expect(JSON.stringify(component.fields)).toContain('budgetValue');
    expect(JSON.stringify(component.fields)).toContain('budgetPeriod');
  });
});
