import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { anything, instance, mock, verify } from 'ts-mockito';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../../core/configurations/injection-keys';
import { CoreState } from '../../../../core/store/core.state';
import { SimpleRegistrationComponent } from './simple-registration.component';

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let element: HTMLElement;

  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
    storeMock = mock(Store);

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CustomFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: USE_SIMPLE_ACCOUNT, useValue: true },
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        { provide: Store, useFactory: () => instance(storeMock) }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SimpleRegistrationComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should set isDirty to true when form is invalid', () => {
    fixture.detectChanges();

    component.simpleRegistrationForm.controls['email'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('12121');

    expect(component.simpleRegistrationForm.valid).toBeFalsy();
    expect(component.simpleRegistrationForm.controls['email'].errors.email).toBeTruthy();
    expect(component.simpleRegistrationForm.controls['password'].errors.minlength).toBeTruthy();

    component.createAccount();

    verify(storeMock.dispatch(anything())).never();
  });

  it('should navigate to homepage when user is created', () => {
    fixture.detectChanges();

    component.simpleRegistrationForm.controls['email'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');

    expect(component.simpleRegistrationForm.valid).toBeTruthy();

    component.createAccount();

    verify(storeMock.dispatch(anything())).once();
  });
});
