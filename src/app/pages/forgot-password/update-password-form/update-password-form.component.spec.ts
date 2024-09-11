import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { UpdatePasswordFormComponent } from './update-password-form.component';

describe('Update Password Form Component', () => {
  let component: UpdatePasswordFormComponent;
  let fixture: ComponentFixture<UpdatePasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePasswordFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

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

    expect(element.innerHTML.match(/ish-password-field/g)).toHaveLength(2);
    expect(element.innerHTML).toContain('password');
    expect(element.innerHTML).toContain('passwordConfirmation');

    expect(element.querySelector('[name="SubmitButton"]')).toBeTruthy();
  });

  it('should emit updatePassword event if form is valid', () => {
    const eventEmitter$ = spy(component.submitPassword);
    fixture.detectChanges();

    const form = component.updatePasswordForm as UntypedFormGroup;

    form.get('password').setValue('!Password01!');
    form.get('passwordConfirmation').setValue('!Password01!');
    component.submitPasswordForm();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.buttonDisabled).toBeFalse();
    component.submitPasswordForm();
    expect(component.buttonDisabled).toBeTrue();
  });
});
