import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0SignInComponent } from './auth0-sign-in.component';

describe('Auth0 Sign In Component', () => {
  let component: Auth0SignInComponent;
  let fixture: ComponentFixture<Auth0SignInComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(Auth0SignInComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
