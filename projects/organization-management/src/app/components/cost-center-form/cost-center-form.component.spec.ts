import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterFormComponent } from './cost-center-form.component';

describe('Cost Center Form Component', () => {
  let component: CostCenterFormComponent;
  let fixture: ComponentFixture<CostCenterFormComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let appFacade: AppFacade;

  const costCenter = {
    costCenterId: '100400',
    name: 'Headquarter',
    budget: { value: 500, currency: 'USD' },
    budgetPeriod: 'monthly',
    active: false,
    spentBudget: { value: 200, currency: 'USD' },
    costCenterOwner: { login: 'jlink@test.intershop.de', firstName: 'Jack', lastName: 'Link' },
  } as CostCenter;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule],
      declarations: [CostCenterFormComponent, MockComponent(ErrorMessageComponent)],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(organizationManagementFacade.costCenterManagerSelectOptions$()).thenReturn(
      of([{ value: 'bboldner@test.intershop.de', label: 'Bernhard Boldner' }])
    );

    component.form = new UntypedFormGroup({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all form input fields for cost center creation/update', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('costCenterId');
    expect(element.innerHTML).toContain('name');
    expect(element.innerHTML).toContain('active');
    expect(element.innerHTML).toContain('manager');
    expect(element.innerHTML).toContain('budgetValue');
    expect(element.innerHTML).toContain('budgetPeriod');
  });

  it('should init the form model with default values if no cost center is given', () => {
    fixture.detectChanges();

    expect(component.form.value.currency).toBe('USD');
    expect(component.form.value.costCenterManager).toBe('bboldner@test.intershop.de');
    expect(component.form.value.budgetPeriod).toBe('fixed');
    expect(component.form.value.active).toBeTrue();
  });

  it('should init the form model with cost center values if a cost center is given', () => {
    component.costCenter = costCenter;

    fixture.detectChanges();

    expect(component.form.value.currency).toBe(costCenter.budget.currency);
    expect(component.form.value.costCenterManager).toBe(costCenter.costCenterOwner.login);
    expect(component.form.value.budgetPeriod).toBe(costCenter.budgetPeriod);
    expect(component.form.value.active).toBe(costCenter.active);
  });
});
