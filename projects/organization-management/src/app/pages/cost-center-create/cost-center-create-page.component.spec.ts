import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CostCenterFormComponent } from '../../components/cost-center-form/cost-center-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterCreatePageComponent } from './cost-center-create-page.component';
import { CostCenterCsvImportComponent } from './cost-center-csv-import/cost-center-csv-import.component';

describe('Cost Center Create Page Component', () => {
  let component: CostCenterCreatePageComponent;
  let fixture: ComponentFixture<CostCenterCreatePageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [CostCenterCreatePageComponent],
      providers: [
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(CostCenterCreatePageComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockComponent(CostCenterFormComponent),
            MockComponent(CostCenterCsvImportComponent),
            MockDirective(FormSubmitDirective),
            MockComponent(LoadingComponent),
            ReactiveFormsModule,
            TranslatePipe,
            RouterLink,
          ],
        },
      })
      .compileComponents();
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
});
