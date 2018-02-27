import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../../../models/customer/customer.model';
import { reducers } from '../../../store/core.system';
import { CoreState, LoginUserFail, LoginUserSuccess } from '../../../store/user';
import { LoginStatusComponent } from './login-status.component';

describe('Login Status Component', () => {
  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;
  let store: Store<CoreState>;
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  } as Customer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot(reducers)
      ],
      declarations: [
        LoginStatusComponent
      ],
      providers: [

      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should render full name on template when user is logged in', async(() => {
    store.dispatch(new LoginUserSuccess(userData));

    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toBeTruthy();
    expect(loggedInDetails.length).toBeGreaterThan(0);
    expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
  }));

  it('should render nothing on template when user is not logged in', async(() => {
    store.dispatch(new LoginUserFail(new HttpErrorResponse({})));

    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails.length).toBe(0);
  }));
});
