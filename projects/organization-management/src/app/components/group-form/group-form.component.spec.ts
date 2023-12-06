import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { Group } from '../../models/group/group.model';

import { GroupFormComponent } from './group-form.component';

describe('Group Form Component', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let element: HTMLElement;
  const rootGroup = {
    id: 'root',
    name: 'ROOT',
    organization: 'acme.org',
  } as Group;
  const childGroup = {
    id: 'child',
    name: 'Child',
    organization: 'acme.org',
  } as Group;
  const groupTree = [rootGroup, childGroup] as Group[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [GroupFormComponent, MockComponent(ErrorMessageComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.groups$ = of(groupTree);
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
