import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { LoginPageComponent } from './login-page.component';

describe('Login Page Component', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
        MockComponent({
          selector: 'ish-login-form-container',
          template: 'Login Form',
        }),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form container on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-form-container')).toBeTruthy();
  });
});
