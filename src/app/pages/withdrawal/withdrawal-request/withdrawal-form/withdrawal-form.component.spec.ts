import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { WithdrawalFormComponent } from './withdrawal-form.component';

describe('Withdrawal Form Component', () => {
  let component: WithdrawalFormComponent;
  let fixture: ComponentFixture<WithdrawalFormComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.serverSetting$<boolean>(anyString())).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [WithdrawalFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('search mode (no withdrawal input)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have isRequestMode as false', () => {
      expect(component.isRequestMode).toBeFalse();
    });

    it('should return search button label', () => {
      expect(component.submitButtonLabel).toBe('account.withdrawal.form.search.button.label');
    });

    it('should initialize model as empty object', () => {
      expect(component.model).toBeEmpty();
    });
  });

  describe('request mode (with withdrawal input)', () => {
    const withdrawal = {
      id: 'w1',
      orderDocumentNumber: 'ORDER-123',
      orderEmail: 'test@example.com',
    } as Withdrawal;

    beforeEach(() => {
      component.withdrawal = withdrawal;
      fixture.detectChanges();
    });

    it('should have isRequestMode as true', () => {
      expect(component.isRequestMode).toBeTrue();
    });

    it('should return request button label', () => {
      expect(component.submitButtonLabel).toBe('account.withdrawal.form.request.button.label');
    });

    it('should pre-fill model with withdrawal data', () => {
      expect(component.model).toMatchObject({
        orderDocumentNumber: 'ORDER-123',
        orderEmail: 'test@example.com',
        confirmationEmail: 'test@example.com',
      });
    });
  });

  describe('submitForm()', () => {
    it('should not emit createWithdrawal when form is invalid', () => {
      fixture.detectChanges();
      const spy = jest.spyOn(component.createWithdrawal, 'emit');

      component.withdrawalForm.setErrors({ required: true });
      component.submitForm();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit createWithdrawal in search mode when form is valid', () => {
      fixture.detectChanges();
      const spy = jest.spyOn(component.createWithdrawal, 'emit');

      component.withdrawalForm.patchValue({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' });
      component.submitForm();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ orderDocumentNumber: 'ORDER-123', orderEmail: 'test@example.com' })
      );
    });

    it('should emit submitWithdrawal in request mode when form is valid', () => {
      const withdrawal = {
        id: 'w1',
        orderDocumentNumber: 'ORDER-123',
        orderEmail: 'test@example.com',
      } as Withdrawal;
      component.withdrawal = withdrawal;
      fixture.detectChanges();

      const spy = jest.spyOn(component.submitWithdrawal, 'emit');

      component.withdrawalForm.patchValue({ name: 'John Doe', confirmationEmail: 'test@example.com' });
      component.submitForm();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          orderDocumentNumber: 'ORDER-123',
          orderEmail: 'test@example.com',
          confirmationEmail: 'test@example.com',
          id: 'w1',
        })
      );
    });
  });
});
