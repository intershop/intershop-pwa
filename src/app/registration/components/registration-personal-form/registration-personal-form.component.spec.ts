import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RegistrationPersonalFormComponent } from './registration-personal-form.component';

describe('Registration Personal Form Component', () => {
  let component: RegistrationPersonalFormComponent;
  let fixture: ComponentFixture<RegistrationPersonalFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationPersonalFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
