import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AVAILABLE_LOCALES } from '../../../configurations/injection-keys';
import { reducers } from '../../../store/core.system';
import { SelectLocale } from '../../../store/locale';
import { LanguageSwitchComponent } from './language-switch.component';

describe('Language Switch Component', () => {
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let component: LanguageSwitchComponent;
  let element: HTMLElement;
  let locales: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BsDropdownModule.forRoot(),
        TranslateModule.forRoot(),
        StoreModule.forRoot(reducers)
      ],
      providers: [
      ],
      declarations: [LanguageSwitchComponent]
    }).compileComponents();
  });

  function findLang(value: string) {
    return locales.find(l => l.value === value);
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    locales = TestBed.get(AVAILABLE_LOCALES);
    TestBed.get(Store).dispatch(new SelectLocale(findLang('en')));
    fixture.autoDetectChanges(true);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show the available language options when language dropdown is clicked', fakeAsync(() => {
    const anchorTag = fixture.debugElement.nativeElement.querySelectorAll('[dropdownToggle]')[0];
    anchorTag.click();
    tick();
    const languageOptions = element.getElementsByTagName('li');
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');

    expect(languageOptions.length).toBeGreaterThan(1);
    expect(component.localizationArray.length).toBeGreaterThan(1);
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  }));

  it('should check language is changed when languageChange menthod is called', () => {
    component.languageChange(findLang('de'));
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('de');
  });
});
