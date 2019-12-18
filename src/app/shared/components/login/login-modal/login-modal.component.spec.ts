import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { LoginFormComponent } from 'ish-shared/forms/components/login-form/login-form.component';

import { LoginModalComponent } from './login-modal.component';

describe('Login Modal Component', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LoginModalComponent, MockComponent(LoginFormComponent), MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display message if message key was supplied', () => {
    component.loginMessageKey = 'dummy';
    fixture.detectChanges();

    expect(element.querySelector('.alert')).toBeTruthy();
    expect(element.querySelector('.alert').textContent).toMatchInlineSnapshot(`" account.login.dummy.message "`);
  });
});
