import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from 'ng-mocks';

import { LoginPageComponent } from './components/login-page/login-page.component';
import { LoginPageContainerComponent } from './login-page.container';

describe('Login Page Container', () => {
  let fixture: ComponentFixture<LoginPageContainerComponent>;
  let component: LoginPageContainerComponent;
  let element: HTMLElement;
  let storeMock$: Store<{}>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [LoginPageContainerComponent, MockComponent(LoginPageComponent)],
      providers: [{ provide: Store, useFactory: () => instance(storeMock$) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-page')).toBeTruthy();
  });
});
