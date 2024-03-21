import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { GroupFormComponent } from '../group-form/group-form.component';

import { HierarchiesCreateGroupComponent } from './hierarchies-create-group.component';

describe('Hierarchies Create Group Component', () => {
  let component: HierarchiesCreateGroupComponent;
  let fixture: ComponentFixture<HierarchiesCreateGroupComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  let fb: FormBuilder;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        HierarchiesCreateGroupComponent,
        MockComponent(GroupFormComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesCreateGroupComponent);
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

    component.groupForm = fb.group({
      organizationGroup: fb.group({
        name: ['Test', [Validators.required]],
        parent: ['Organization', [Validators.required]],
        description: [''],
      }),
    });

    expect(component.formDisabled).toBeFalse();
    component.submitForm();
    expect(component.formDisabled).toBeFalse();

    verify(organizationHierarchiesFacade.createAndAddGroup(anything(), anything())).once();
  });
});
