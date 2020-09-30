import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';

import { LanguageSwitchComponent } from './language-switch.component';

describe('Language Switch Component', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  const locales = [
    { lang: 'en_US', value: 'en', displayName: 'English' },
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async () => {
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [LanguageSwitchComponent, MakeHrefPipe, MockComponent(FaIconComponent)],
      imports: [NgbDropdownModule, RouterTestingModule],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const router = TestBed.inject(Router);
    router.initialNavigation();
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
        <a href="/;redirect=1;lang=en_US"> English </a>,
        <a href="/;redirect=1;lang=fr_FR"> Fran¢aise </a>,
      ]
    `);
    expect(element.querySelector('.language-switch-current-selection').textContent).toMatchInlineSnapshot(`"de"`);
  });
});
