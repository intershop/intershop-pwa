import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from '../../../../utils/dev/mock.component';

import { LoginStatusContainerComponent } from './login-status.container';

describe('Login Status Container', () => {
  let component: LoginStatusContainerComponent;
  let fixture: ComponentFixture<LoginStatusContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginStatusContainerComponent,
        MockComponent({
          selector: 'ish-login-status',
          template: 'Login Status',
          inputs: ['user', 'view'],
        }),
        MockComponent({
          selector: 'ish-logout',
          template: 'Logout',
          inputs: ['user', 'view'],
        }),
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
