import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { UserBudgetFormComponent } from './user-budget-form.component';

describe('User Budget Form Component', () => {
  let component: UserBudgetFormComponent;
  let fixture: ComponentFixture<UserBudgetFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockComponent(InputComponent),
        MockDirective(ShowFormFeedbackDirective),
        UserBudgetFormComponent,
      ],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBudgetFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
    when(appFacade.currentLocale$).thenReturn(of({ currency: 'USD' } as Locale));

    component.form = fb.group({
      budget: [''],
      budgetPeriod: [''],
      currency: [''],
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should write current currency into the form after init', () => {
    fixture.detectChanges();

    expect(component.form.get('currency').value).toBe('USD');
  });

  it('should display form input fields after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[controlname=orderSpentLimit]')).toBeTruthy();
    expect(element.querySelector('[formControlname=budget]')).toBeTruthy();
    expect(element.querySelector('[formControlname=budgetPeriod]')).toBeTruthy();
  });
});
