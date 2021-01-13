import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { Group, GroupTree } from '../../models/group/group.model';

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
  const groupTree = {
    edges: { root: ['child'] },
    groups: { root: rootGroup, child: childGroup },
    rootIds: ['root'],
  } as GroupTree;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        GroupFormComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(InputComponent),
        MockComponent(SelectComponent),
        MockComponent(TextareaComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parents = groupTree;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[controlname=name]')).toBeTruthy();
    expect(element.querySelector('[controlname=parent]')).toBeTruthy();
    expect(element.querySelector('[controlname=description]')).toBeTruthy();
  });
});
