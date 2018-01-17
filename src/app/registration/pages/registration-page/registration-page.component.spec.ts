import { Location } from '@angular/common';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from '../../../mocking/components/mock.component';
import { SharedModule } from '../../../shared/shared.module';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({ selector: 'ish-registration-credentials-form', template: 'Credentials Template', inputs: ['parentForm'] }),
        MockComponent({ selector: 'ish-address-form', template: 'Address Template', inputs: ['parentForm'] }),
        MockComponent({ selector: 'ish-registration-personal-form', template: 'Personal Template', inputs: ['parentForm'] }),
        MockComponent({ selector: 'ish-captcha', template: 'Captcha Template' }),
      ],
      providers: [
      ],
      imports: [
        SharedModule,
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

  it('should check if controls and components are getting rendered on the page', () => {
    expect(element.getElementsByTagName('h1')).toBeTruthy('h1 exists on page');
    expect(element.getElementsByTagName('ish-registration-credentials-form')[0].innerHTML).toEqual('Credentials Template');
    expect(element.getElementsByTagName('ish-address-form')[0].innerHTML).toEqual('Address Template');
    expect(element.getElementsByTagName('ish-registration-personal-form')[0].innerHTML).toEqual('Personal Template');
    expect(element.getElementsByTagName('ish-captcha')[0].innerHTML).toEqual('Captcha Template');
  });

});
