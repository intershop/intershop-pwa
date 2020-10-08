import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { Node, NodeTree } from '../../models/node/node.model';

import { GroupFormComponent } from './group-form.component';

describe('Group Form Component', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;
  const rootNode = {
    id: 'root',
    name: 'ROOT',
    organization: 'acme.org',
  } as Node;
  const childNode = {
    id: 'child',
    name: 'Child',
    organization: 'acme.org',
  } as Node;
  const nodeTree = {
    edges: { root: ['child'] },
    nodes: { root: rootNode, child: childNode },
    rootIds: ['root'],
  } as NodeTree;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
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
    component.parents = nodeTree;
    fb = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fb).toBeTruthy();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[controlname=name]')).toBeTruthy();
    expect(element.querySelector('[controlname=parent]')).toBeTruthy();
    expect(element.querySelector('[controlname=description]')).toBeTruthy();
  });

  it('should process parents if component input changes', () => {
    expect(component.parentOptions).toBeUndefined();
    const changes: SimpleChanges = {
      parents: new SimpleChange(undefined, component.parents, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.parentOptions).toBeArrayOfSize(2);
    expect(component.parentOptions[0]).toStrictEqual({ label: childNode.name, value: childNode.id });
    expect(component.parentOptions[1]).toStrictEqual({ label: rootNode.name, value: rootNode.id });
  });
});
