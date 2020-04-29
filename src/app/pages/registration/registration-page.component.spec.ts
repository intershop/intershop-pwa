import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationPageComponent } from './registration-page.component';

describe('Registration Page Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent, MockComponent(RegistrationFormComponent), RegistrationPageComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
    }).compileComponents();

    location = TestBed.inject(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to homepage when cancel is clicked', fakeAsync(() => {
    component.onCancel();

    tick(500);

    expect(location.path()).toEqual('/home');
  }));
});
