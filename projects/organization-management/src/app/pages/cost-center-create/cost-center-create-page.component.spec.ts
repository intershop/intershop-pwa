import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CostCenterFormComponent } from '../../components/cost-center-form/cost-center-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterCreatePageComponent } from './cost-center-create-page.component';

describe('Cost Center Create Page Component', () => {
  let component: CostCenterCreatePageComponent;
  let fixture: ComponentFixture<CostCenterCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CostCenterCreatePageComponent, MockComponent(CostCenterFormComponent)],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterCreatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(FormBuilder);
    component.form = fb.group({
      costCenterId: ['100400', [Validators.required]],
      name: ['Marketing', [Validators.required]],
      active: [true],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the cost center form after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('ish-cost-center-form')).toBeTruthy();
  });

  it('should not submit a form when the user does not fill all required fields', () => {
    component.form = fb.group({
      costCenterId: ['', [Validators.required]],
    });

    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();

    expect(component.formDisabled).toBeTrue();
  });

  it('should submit a form when the user fills all required fields', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();

    expect(component.formDisabled).toBeFalse();
  });
});
