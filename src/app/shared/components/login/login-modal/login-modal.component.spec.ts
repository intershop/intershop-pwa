import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { IdentityProviderLoginComponent } from 'ish-shared/components/login/identity-provider-login/identity-provider-login.component';

import { LoginModalComponent } from './login-modal.component';

describe('Login Modal Component', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        LoginModalComponent,
        MockComponent(IdentityProviderLoginComponent),
        MockDirective(ServerHtmlDirective),
      ],
    }).compileComponents();
  });

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
