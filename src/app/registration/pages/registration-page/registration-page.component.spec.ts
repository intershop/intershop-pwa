import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { MockComponent } from '../../../mocking/components/mock.component';
import { Customer } from '../../../models/customer/customer.model';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerRegistrationService } from '../../services/customer-registration.service';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async(() => {
    const customerRegistrationServiceMock = mock(CustomerRegistrationService);
    when(customerRegistrationServiceMock.registerPrivateCustomer(anything())).thenReturn(of(new Customer()));

    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({ selector: 'ish-registration-credentials-form', template: 'Credentials Template', inputs: ['parentForm'] }),
        MockComponent({ selector: 'ish-address-form', template: 'Address Template', inputs: ['parentForm'] }),
        MockComponent({ selector: 'ish-registration-personal-form', template: 'Personal Template', inputs: ['parentForm'] }),
        // MockComponent({ selector: 'ish-captcha', template: 'Captcha Template' }),
      ],
      providers: [
        { provide: CustomerRegistrationService, useFactory: () => instance(customerRegistrationServiceMock) },
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: RegistrationPageComponent }
        ]),
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should create a registration form on creation', () => {
    expect(component.registrationForm).toBeUndefined('registration form has not been created before init');
    fixture.detectChanges();
    expect(component.registrationForm.get('preferredLanguage')).toBeTruthy('registration form contains a preferredLanguage control');
    expect(component.registrationForm.get('birthday')).toBeTruthy('registration form contains a birthday control');
  });

  it('should navigate to homepage when cancel is clicked', async(() => {
    expect(location.path()).toBe('', 'start location');
    component.cancelClicked();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/home');
    });
  }));

  it('should set isDirty variable if submit is clicked and form is not valid', async(() => {
    component.registrationForm = new FormGroup({
      preferredLanguage: new FormControl('', Validators.required),
    });
    expect(component.isDirty).toBeFalsy('isDirty is false after component init');
    component.onCreateAccount();
    fixture.whenStable().then(() => {
      expect(component.isDirty).toBeTruthy('isDirty is true after submitting an invalid form');
    });
  }));

  it('should check if controls and components are getting rendered on the page', () => {
    expect(element.getElementsByTagName('h1')).toBeTruthy('h1 exists on page');
    expect(element.getElementsByTagName('ish-registration-credentials-form')[0].innerHTML).toEqual('Credentials Template');
    expect(element.getElementsByTagName('ish-address-form')[0].innerHTML).toEqual('Address Template');
    expect(element.getElementsByTagName('ish-registration-personal-form')[0].innerHTML).toEqual('Personal Template');
    // expect(element.getElementsByTagName('ish-captcha')[0].innerHTML).toEqual('Captcha Template');
  });

});
