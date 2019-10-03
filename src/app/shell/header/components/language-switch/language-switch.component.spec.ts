import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { Locale } from 'ish-core/models/locale/locale.model';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';

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
      imports: [NgbDropdownModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LanguageSwitchComponent, MockComponent(FaIconComponent), MockPipe(MakeHrefPipe)],
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
});
