import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RegistrationPageContainerComponent } from './registration-page.container';

describe('Registration Page Container', () => {
  let fixture: ComponentFixture<RegistrationPageContainerComponent>;
  let component: RegistrationPageContainerComponent;
  let element: HTMLElement;
  let location: Location;

  const defaultLocales = [
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  // tslint:disable-next-line:use-component-change-detection
  @Component({ template: 'dummy' })
  // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
  class DummyComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: ['languages', 'error'],
        }),
        RegistrationPageContainerComponent,
      ],
      providers: [{ provide: AVAILABLE_LOCALES, useValue: defaultLocales }],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        StoreModule.forRoot(coreReducers),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageContainerComponent);
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
