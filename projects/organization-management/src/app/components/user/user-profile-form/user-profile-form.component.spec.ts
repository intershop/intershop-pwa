import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectTitleComponent } from 'ish-shared/forms/components/select-title/select-title.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { UserProfileFormComponent } from './user-profile-form.component';

describe('User Profile Form Component', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;
  let appFacade: AppFacade;

  beforeEach(async(() => {
    appFacade = mock(AppFacade);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(InputComponent),
        MockComponent(SelectTitleComponent),
        UserProfileFormComponent,
      ],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
    when(appFacade.currentLocale$).thenReturn(of({ lang: 'en_US' } as Locale));

    component.form = fb.group({
      email: ['', [Validators.required, SpecialValidators.email]],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[controlname=firstName]')).toBeTruthy();
    expect(element.querySelector('[controlname=lastName]')).toBeTruthy();
    expect(element.querySelector('[controlname=phone]')).toBeTruthy();
  });
});
