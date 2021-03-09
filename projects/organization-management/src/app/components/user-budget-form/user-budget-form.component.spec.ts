import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { UserBudgetFormComponent } from './user-budget-form.component';

describe('User Budget Form Component', () => {
  let component: UserBudgetFormComponent;
  let fixture: ComponentFixture<UserBudgetFormComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule],
      declarations: [UserBudgetFormComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBudgetFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.currentLocale$).thenReturn(of({ currency: 'USD' } as Locale));

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

    expect(element.innerHTML).toContain('currency');
    expect(element.innerHTML).toContain('orderSpentLimitValue');

    expect(JSON.stringify(component.fields)).toContain('budgetValue');
    expect(JSON.stringify(component.fields)).toContain('budgetPeriod');
  });
});
