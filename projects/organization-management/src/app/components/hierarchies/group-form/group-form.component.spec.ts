import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { GroupFormComponent } from './group-form.component';

describe('Group Form Component', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        GroupFormComponent,
        MockComponent(InputComponent),
        MockComponent(SelectComponent),
        MockComponent(TextareaComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
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
});
