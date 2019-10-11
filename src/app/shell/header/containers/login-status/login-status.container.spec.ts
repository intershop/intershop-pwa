import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoginStatusComponent } from 'ish-shell/header/components/login-status/login-status.component';
import { LogoutComponent } from 'ish-shell/header/components/logout/logout.component';

import { LoginStatusContainerComponent } from './login-status.container';

describe('Login Status Container', () => {
  let component: LoginStatusContainerComponent;
  let fixture: ComponentFixture<LoginStatusContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginStatusContainerComponent,
        MockComponent(LoginStatusComponent),
        MockComponent(LogoutComponent),
      ],
      imports: [ngrxTesting()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginStatusContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
