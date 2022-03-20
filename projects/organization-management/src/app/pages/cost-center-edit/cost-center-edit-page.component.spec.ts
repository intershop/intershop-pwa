import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';

import { CostCenterFormComponent } from '../../components/cost-center-form/cost-center-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterEditPageComponent } from './cost-center-edit-page.component';

describe('Cost Center Edit Page Component', () => {
  let component: CostCenterEditPageComponent;
  let fixture: ComponentFixture<CostCenterEditPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  const costCenter = {
    costCenterId: '100400',
    name: 'Headquarter',
    budget: { value: 500, currency: 'USD' },
    budgetPeriod: 'monthly',
    spentBudget: { value: 200, currency: 'USD' },
    costCenterOwner: { login: 'jlink@test.intershop.de', firstName: 'Jack', lastName: 'Link' },
  } as CostCenter;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CostCenterEditPageComponent, MockComponent(CostCenterFormComponent)],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();

    when(organizationManagementFacade.selectedCostCenter$).thenReturn(of(costCenter));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterEditPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(FormBuilder);
    component.form = fb.group({
      costCenterId: [costCenter.costCenterId, [Validators.required]],
      name: [costCenter.name, [Validators.required]],
      active: [true],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the cost center form if a cost center is given', () => {
    fixture.detectChanges();

    expect(element.querySelector('ish-cost-center-form')).toBeTruthy();
  });

  it('should not submit a form when the user does not fill all required fields', () => {
    component.form = fb.group({
      costCenterId: ['', [Validators.required]],
    });

    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm(costCenter);

    expect(component.formDisabled).toBeTrue();
  });

  it('should submit a form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm(costCenter);

    expect(component.formDisabled).toBeFalse();
  });
});
