import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RegistrationPageContainerComponent } from './registration-page.container';

describe('Registration Page Container', () => {
  let fixture: ComponentFixture<RegistrationPageContainerComponent>;
  let component: RegistrationPageContainerComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let storeMock$: Store<{}>;
  const defaultLocales = [
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async(() => {
    routerMock = mock(Router);
    storeMock$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: ['languages', 'error'],
        }),
        RegistrationPageContainerComponent,
      ],
      providers: [
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: Store, useFactory: () => instance(storeMock$) },
        { provide: AVAILABLE_LOCALES, useValue: defaultLocales },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
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

  it('should navigate to homepage when cancel is clicked', async(() => {
    component.onCancel();

    verify(routerMock.navigate(anything())).once();
    const [param] = capture(routerMock.navigate).last();
    expect(param).toEqual(['/home']);
  }));
});
