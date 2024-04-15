import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';

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
    when(appFacade.currencySymbol$(anything())).thenReturn(of('$'));

    organizationManagementFacade = mock(organizationManagementFacade);

    await TestBed.configureTestingModule({
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
      budgetValue: [123],
      budgetPeriod: ['monthly'],
    });

    component.costCenterBuyerForm = form;
    component.show({
      login: 'jlink@test.intershop.de',
      budget: { currency: 'USD', value: 10000 },
    } as CostCenterBuyer);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all form input fields for cost center buyer update', () => {
    fixture.detectChanges();

    expect(JSON.stringify(component.fields)).toContain('buyerName');
    expect(JSON.stringify(component.fields)).toContain('budgetValue');
    expect(JSON.stringify(component.fields)).toContain('budgetPeriod');
  });
});
