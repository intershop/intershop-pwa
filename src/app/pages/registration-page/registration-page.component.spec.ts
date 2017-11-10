import { Location } from '@angular/common';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../components/mock.component';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({ selector: 'is-email-password', template: 'Email Template' }),
        MockComponent({ selector: 'is-address', template: 'Address Template' }),
        MockComponent({ selector: 'is-captcha', template: 'Captcha Template' }),
      ],
      providers: [
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: RegistrationPageComponent }
        ])
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

  it('should navigate to homepage when cancel is clicked', async(() => {
    expect(location.path()).toBe('');
    component.cancelClicked();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/home');
    });
  }));

  it('should check if controls are getting rendered on the page', () => {
    expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('Create a New Account');
    expect(element.getElementsByTagName('is-email-password')[0].innerHTML).toEqual('Email Template');
    expect(element.getElementsByTagName('is-captcha')[0].innerHTML).toEqual('Captcha Template');
    expect(element.getElementsByTagName('is-address')[0].innerHTML).toEqual('Address Template');
  });

});
