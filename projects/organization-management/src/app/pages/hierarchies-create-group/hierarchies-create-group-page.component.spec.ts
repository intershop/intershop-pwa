import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { GroupFormComponent } from '../../components/group-form/group-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { HierarchiesCreateGroupPageComponent } from './hierarchies-create-group-page.component';

describe('Hierarchies Create Group Page Component', () => {
  let component: HierarchiesCreateGroupPageComponent;
  let fixture: ComponentFixture<HierarchiesCreateGroupPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        HierarchiesCreateGroupPageComponent,
        MockComponent(GroupFormComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesCreateGroupPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fb).toBeTruthy();
  });

  it('should display form interactions after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('ish-loading')).toBeFalsy();
    expect(element.querySelector('[data-testing-id="create-group-cancel"]').textContent).toMatchInlineSnapshot(
      `" account.cancel.link "`
    );
    expect(element.querySelector('[data-testing-id="create-group-submit"]').textContent).toMatchInlineSnapshot(
      `" account.organization.hierarchies.groups.new.button.label "`
    );
  });

  it('should submit a valid form when the user fills all required fields', () => {
    fixture.detectChanges();

    component.form = fb.group({
      org_group: fb.group({
        name: ['Test', [Validators.required]],
        parent: ['Organization', [Validators.required]],
        description: [''],
      }),
    });

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeFalse();

    verify(organizationManagementFacade.createAndAddGroup(anything(), anything())).once();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeTrue();
  });
});
