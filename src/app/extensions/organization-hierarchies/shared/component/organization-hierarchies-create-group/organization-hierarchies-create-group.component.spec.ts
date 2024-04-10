import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroupFormComponent } from '../organization-hierarchies-group-form/organization-hierarchies-group-form.component';

import { OrganizationHierarchiesCreateGroupComponent } from './organization-hierarchies-create-group.component';

describe('Organization Hierarchies Create Group Component', () => {
  let component: OrganizationHierarchiesCreateGroupComponent;
  let fixture: ComponentFixture<OrganizationHierarchiesCreateGroupComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  let fb: FormBuilder;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(OrganizationHierarchiesGroupFormComponent),
        OrganizationHierarchiesCreateGroupComponent,
      ],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchiesCreateGroupComponent);
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

    expect(element.querySelector('[data-testing-id="create-group-cancel"]').textContent).toMatchInlineSnapshot(
      `" checkout.address.cancel.button.label "`
    );
    expect(element.querySelector('[data-testing-id="create-group-submit"]').textContent).toMatchInlineSnapshot(
      `" account.organization.hierarchies.groups.new.button.label "`
    );
  });

  it('should submit a valid form when the user fills all required fields', fakeAsync(() => {
    fixture.detectChanges();
    component.groupForm = fb.group({
      groupName: ['Test', [Validators.required]],
      parentGroupId: ['parentID', [Validators.required]],
      groupDescription: ['lorum ipsum'],
    });

    component.submitForm();
    const emitter = spy(component.save);

    component.submitForm();
    tick(1000);
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg.parentGroupId).toBe('parentID');
    expect(arg.child.displayName).toBe('Test');
    expect(arg.child.description).toBe('lorum ipsum');
  }));
});
