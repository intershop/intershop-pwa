import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { InputBirthdayComponent } from 'ish-shared/forms/components/input-birthday/input-birthday.component';
import { SelectLanguageComponent } from 'ish-shared/forms/components/select-language/select-language.component';

import { RegistrationPersonalFormComponent } from './registration-personal-form.component';

describe('Registration Personal Form Component', () => {
  let component: RegistrationPersonalFormComponent;
  let fixture: ComponentFixture<RegistrationPersonalFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(InputBirthdayComponent),
        MockComponent(SelectLanguageComponent),
        RegistrationPersonalFormComponent,
      ],
      imports: [ReactiveFormsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationPersonalFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const parentForm = new FormGroup({
          preferredLanguage: new FormControl(),
          birthday: new FormControl(),
        });
        component.parentForm = parentForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should throw an error if control preferredLanguage does not exist', () => {
    component.parentForm.removeControl('preferredLanguage');
    expect(() => fixture.detectChanges()).toThrowError(/.*required.*preferredLanguage.*/);
  });

  it('should throw an error if control birthday does not exist', () => {
    component.parentForm.removeControl('birthday');
    expect(() => fixture.detectChanges()).toThrowError(/.*required.*birthday.*/);
  });
});
