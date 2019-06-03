import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { InputComponent } from '../../../../shared/forms/components/input/input.component';

import { AccountProfileEmailPageComponent } from './account-profile-email-page.component';

describe('Account Profile Email Page Component', () => {
  let component: AccountProfileEmailPageComponent;
  let fixture: ComponentFixture<AccountProfileEmailPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AccountProfileEmailPageComponent, MockComponent(InputComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileEmailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 2 input fields for email and emailConfirmation', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-input')).toHaveLength(2);
  });

  it('should emit updateEmail event if form is valid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    component.form.get('email').setValue('patricia@test.intershop.de');
    component.form.get('emailConfirmation').setValue('patricia@test.intershop.de');
    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateEmail event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateEmail);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.submitted).toBeFalse();
    component.submit();
    expect(component.submitted).toBeTrue();
  });
});
