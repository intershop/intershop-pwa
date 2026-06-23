import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { Auth0SignInComponent } from './auth0-sign-in.component';

describe('Auth0 Sign In Component', () => {
  let component: Auth0SignInComponent;
  let fixture: ComponentFixture<Auth0SignInComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Auth0SignInComponent],
      imports: [RouterModule, TranslatePipe],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();
  });

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
