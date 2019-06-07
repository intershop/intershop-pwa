import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { InputComponent } from '../../../../shared/forms/components/input/input.component';

import { AccountProfileCompanyPageComponent } from './account-profile-company-page.component';

describe('Account Profile Company Page Component', () => {
  let component: AccountProfileCompanyPageComponent;
  let fixture: ComponentFixture<AccountProfileCompanyPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AccountProfileCompanyPageComponent, MockComponent(InputComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileCompanyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display 3 input fields for companyName, companyName2 and taxationID', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-input')).toHaveLength(3);
  });

  it('should emit updateCompanyProfile event if form is valid', () => {
    const eventEmitter$ = spy(component.updateCompanyProfile);

    component.currentCustomer = { customerNo: '4711', type: 'SMBCustomer', companyName: 'OilCorp' } as Customer;
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).once();
  });

  it('should not emit updateCompanyProfile event if form is invalid', () => {
    const eventEmitter$ = spy(component.updateCompanyProfile);
    fixture.detectChanges();

    component.submit();

    verify(eventEmitter$.emit(anything())).never();
  });

  it('should disable submit button when the user submits an invalid form', () => {
    fixture.detectChanges();

    expect(component.buttonDisabled).toBeFalse();
    component.submit();
    expect(component.buttonDisabled).toBeTrue();
  });
});
