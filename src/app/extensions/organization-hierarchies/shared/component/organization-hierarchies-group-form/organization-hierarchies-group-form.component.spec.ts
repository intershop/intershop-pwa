import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrganizationHierarchiesGroup } from '../../../models/organization-hierarchies-group/organization-hierarchies-group.model';

import { OrganizationHierarchiesGroupFormComponent } from './organization-hierarchies-group-form.component';

describe('Organization Hierarchies Group Form Component', () => {
  let component: OrganizationHierarchiesGroupFormComponent;
  let fixture: ComponentFixture<OrganizationHierarchiesGroupFormComponent>;
  let element: HTMLElement;
  const rootGroup = {
    id: 'root',
    displayName: 'ROOT',
  } as OrganizationHierarchiesGroup;
  const childGroup = {
    id: 'child',
    displayName: 'Child',
  } as OrganizationHierarchiesGroup;
  const groupTree = [rootGroup, childGroup] as OrganizationHierarchiesGroup[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(ErrorMessageComponent), OrganizationHierarchiesGroupFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchiesGroupFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.groups$ = of(groupTree);
    component.selectedParentGroup$ = of(rootGroup);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();

    expect(element.innerHTML).toContain('groupName');
    expect(element.innerHTML).toContain('groupDescription');
    expect(element.innerHTML).toContain('parentGroupId');
  });
});
