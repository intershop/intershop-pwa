import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Observable } from 'rxjs/Observable';
import { instance, mock } from 'ts-mockito';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { LanguageSwitchComponent } from './language-switch.component';

class DummyTraslateService {
  parser = {
    currentLocale: { lang: 'en', currency: 'USD' },
    urlPrefix: (str: string): string => str,
    currentLang: 'en_US'
  };
  changeLanguage(locale: any): Observable<any> {
    this.parser.currentLocale = locale;
    return Observable.of(locale);
  }
}

describe('Language Switch Component', () => {
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let component: LanguageSwitchComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BsDropdownModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [LanguageSwitchComponent],
      providers: [
        { provide: LocalizeRouterService, useClass: DummyTraslateService },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show the available language options when language dropdown is clicked', fakeAsync(() => {
    const anchorTag = fixture.debugElement.nativeElement.querySelectorAll('[dropdownToggle]')[0];
    anchorTag.click();
    tick();
    fixture.detectChanges();
    const languageOptions = element.getElementsByTagName('li');
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');

    expect(languageOptions.length).toBeGreaterThan(1);
    expect(component.localizationArray.length).toBeGreaterThan(1);
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  }));

  it('should check language is changed when languageChange menthod is called', () => {
    component.languageChange({ 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' });
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });
});
