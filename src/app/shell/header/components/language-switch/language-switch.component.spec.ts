import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { deepEqual, spy, verify } from 'ts-mockito';

import { IconModule } from 'ish-core/icon.module';
import { Locale } from 'ish-core/models/locale/locale.model';

import { LanguageSwitchComponent } from './language-switch.component';

describe('Language Switch Component', () => {
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let component: LanguageSwitchComponent;
  let element: HTMLElement;
  const locales = [
    { lang: 'en_US', value: 'en', displayName: 'English' },
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, NgbDropdownModule, TranslateModule.forRoot()],
      declarations: [LanguageSwitchComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LanguageSwitchComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        component.availableLocales = locales;
        component.locale = locales[1];
      });
  }));

  function findLang(value: string) {
    return locales.find(l => l.value === value);
  }

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the available language options when language dropdown is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const anchorTag = fixture.nativeElement.querySelectorAll('[ngbDropdownToggle]')[0];
    anchorTag.click();
    tick(500);
    fixture.detectChanges();
    const languageOptions = element.getElementsByTagName('li');
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');

    expect(languageOptions.length).toBeGreaterThan(1);
    expect(component.locale).toEqual(findLang('de'));
    expect(component.availableLocales).toEqual(locales);
    expect(selectedLanguage[0].textContent.trim()).toEqual('de');
  }));

  it('should change language when languageChange method is called', () => {
    const FR = findLang('fr');

    const emitter = spy(component.localeChange);
    component.switch(FR);
    verify(emitter.emit(deepEqual(FR))).once();

    // setting from container
    component.locale = FR;
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('fr');
  });
});
