import { LanguageSwitchComponent } from './language-switch.component';
import { TestBed, ComponentFixture, tick, fakeAsync, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core/';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { mock, instance, when, anything, verify } from 'ts-mockito';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { GlobalState } from '../../../services/global.state';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

class DummyRouter {
  get url() {
    return 'test';
  }
}

describe('Language Switch Component', () => {
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let component: LanguageSwitchComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;
  let localizeRouterServiceMock: LocalizeRouterService;
  let globalStateMock: GlobalState;

  beforeEach(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);
    globalStateMock = mock(GlobalState);

    TestBed.configureTestingModule({
      imports: [
        BsDropdownModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [LanguageSwitchComponent],
      providers: [
        { provide: LocalizeRouterService, useClass: DummyTraslateService },
        { provide: GlobalState, useFactory: () => instance(globalStateMock) },
        { provide: Router, useClass: DummyRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
  });

  xit('should check if more than 1 language options are available on the template', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('[dropdownToggle]')[0].click(); // trigger drop down opening
    const languageOptions = element.getElementsByTagName('li');
    expect(languageOptions.length).toBeGreaterThan(1);

    expect(component.localizationArray.length).toBeGreaterThan(1);

    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });

  it('should check language is changed when languageChange menthod is called', () => {
    component.languageChange({ 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' } );
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });
});
