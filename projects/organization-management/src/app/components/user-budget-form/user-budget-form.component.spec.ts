import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyConfig, FormlyForm } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';

import { UserBudgetFormComponent } from './user-budget-form.component';

describe('User Budget Form Component', () => {
  let component: UserBudgetFormComponent;
  let fixture: ComponentFixture<UserBudgetFormComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let formlyConfig: FormlyConfig;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    formlyConfig = mock(FormlyConfig);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(FormlyForm), UserBudgetFormComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: FormlyConfig, useFactory: () => instance(formlyConfig) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBudgetFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.currentLocale$).thenReturn(of({ currency: 'USD' } as Locale));
    when(formlyConfig.getType(anything())).thenReturn({ name: '', wrappers: [] });

    component.form = new FormGroup({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should write current currency into the form after init', () => {
    fixture.detectChanges();

    expect(component.model.currency).toBe('USD');
  });

  it('should have form input fields after creation', () => {
    fixture.detectChanges();

    expect(JSON.stringify(component.fields)).toContain('currency');
    expect(JSON.stringify(component.fields)).toContain('orderSpentLimitValue');
    expect(JSON.stringify(component.fields)).toContain('budgetValue');
    expect(JSON.stringify(component.fields)).toContain('budgetPeriod');
  });
});
