import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LoginStatusComponent } from '../../components/login-status/login-status.component';
import { LogoutComponent } from '../../components/logout/logout.component';

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
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
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
