import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { UpdatePasswordFormComponent } from './update-password-form.component';

describe('Update Password Form Component', () => {
  let component: UpdatePasswordFormComponent;
  let fixture: ComponentFixture<UpdatePasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(InputComponent), UpdatePasswordFormComponent],
      imports: [
        FeatureToggleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot password form step 2 for password reminder', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-input[controlname=password]')).toBeTruthy();
    expect(element.querySelector('ish-input[controlname=passwordConfirmation]')).toBeTruthy();
    expect(element.querySelector('[name="SubmitButton"]')).toBeTruthy();
  });
});
