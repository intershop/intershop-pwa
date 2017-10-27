import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { LanguageSwitchComponent } from './language-switch.component';

describe('Language Switch Component', () => {
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let component: LanguageSwitchComponent;
  let element: HTMLElement;
  const mockLocalizeRouterService: any = mock(LocalizeRouterService);
  const localizeRouterServiceMock: any = instance(mockLocalizeRouterService);
  localizeRouterServiceMock.parser = {
    currentLocale: { lang: 'en', currency: 'USD' },
    urlPrefix: (str: string): string => str,
    currentLang: 'en_US'
  };
  when(mockLocalizeRouterService.changeLanguage(anything())).thenCall((locale: any) => {
    localizeRouterServiceMock.parser.currentLocale = locale;
    return Observable.of(locale);
  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        BsDropdownModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: LocalizeRouterService, useFactory: () => localizeRouterServiceMock },
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
        { provide: Router, useFactory: () => instance(mock(Router)) },
      ],
      declarations: [LanguageSwitchComponent]
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

  xit('should check if more than 1 language options are available on the template', () => {
    fixture.nativeElement.querySelectorAll('[dropdownToggle]')[0].click(); // trigger drop down opening
    const languageOptions = element.getElementsByTagName('li');
    expect(languageOptions.length).toBeGreaterThan(1);

    expect(component.localizationArray.length).toBeGreaterThan(1);

    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });

  it('should check language is changed when languageChange menthod is called', () => {
    component.languageChange({ 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' });
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });
});
