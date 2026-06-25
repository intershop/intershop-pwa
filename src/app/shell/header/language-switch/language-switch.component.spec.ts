import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { LanguageSwitchComponent } from './language-switch.component';

describe('Language Switch Component', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  const locales = ['en_US', 'de_DE', 'fr_FR'];
  const cookiesServiceMock = mock(CookiesService);
  const featureToggleServiceMock = mock(FeatureToggleService);

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.serverConfigurationLoaded$).thenReturn(of(true));
    when(appFacade.availableLocales$).thenReturn(of(['en_US']));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    await TestBed.configureTestingModule({
      imports: [LanguageSwitchComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CookiesService, useValue: instance(cookiesServiceMock) },
        { provide: FeatureToggleService, useValue: instance(featureToggleServiceMock) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(LanguageSwitchComponent, {
        set: {
          imports: [
            NgbDropdownModule,
            AsyncPipe,
            MockPipe(MakeHrefPipe, (_, urlParams) => of(urlParams.lang)),
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const router = TestBed.inject(Router);
    router.initialNavigation();

    const translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    translate.use('en');
    translate.set('locale.en_US.long', 'English (United States)');
    translate.set('locale.fr_FR.long', 'Français (France)');
    translate.set('locale.de_DE.short', 'Deutsch');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the available language options when rendered', () => {
    when(appFacade.availableLocales$).thenReturn(of(locales));
    when(appFacade.currentLocale$).thenReturn(of(locales[1]));

    fixture.detectChanges();

    expect(element.querySelectorAll('li')).toHaveLength(2);
    expect(element.querySelectorAll('[href]')).toMatchInlineSnapshot(`
      NodeList [
        <a href="en_US" lang="locale.en_US.short"> English (United States) </a>,
        <a href="fr_FR" lang="locale.fr_FR.short"> Français (France) </a>,
      ]
    `);
    expect(element.querySelector('.language-switch-current-selection').textContent).toMatchInlineSnapshot(
      `"locale.de_DE.long"`
    );
  });

  it('should not render the language switch when only one locale is available', () => {
    when(appFacade.availableLocales$).thenReturn(of(['en_US']));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    fixture.detectChanges();

    expect(element.querySelector('.language-switch')).toBeFalsy();
  });

  it('should not render the language switch when server configuration is not yet loaded', () => {
    when(appFacade.serverConfigurationLoaded$).thenReturn(of(false));
    when(appFacade.availableLocales$).thenReturn(of(locales));
    when(appFacade.currentLocale$).thenReturn(of(locales[0]));

    fixture.detectChanges();

    expect(element.querySelector('.language-switch')).toBeFalsy();
  });
});
