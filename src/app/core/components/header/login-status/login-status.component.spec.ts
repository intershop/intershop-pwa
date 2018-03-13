import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../../../models/customer/customer.model';
import { LoginStatusComponent } from './login-status.component';

describe('Login Status Component', () => {
  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;

  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        LoginStatusComponent
      ],
      providers: [
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginStatusComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render full name on template when user is logged in', () => {
    component.customer = userData;

    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toBeTruthy();
    expect(loggedInDetails.length).toBeGreaterThan(0);
    expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
  });

  it('should render nothing on template when user is not logged in', () => {
    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails.length).toBe(0);
  });
});
