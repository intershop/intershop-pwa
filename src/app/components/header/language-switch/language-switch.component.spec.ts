import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { instance, mock } from 'ts-mockito';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { LanguageSwitchComponent } from './language-switch.component';

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
      providers: [
        { provide: CurrentLocaleService, useFactory: () => instance(mock(CurrentLocaleService)) },
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

  xit('should show the available language options when language dropdown is clicked', fakeAsync(() => {
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

  xit('should check language is changed when languageChange menthod is called', () => {
    // component.languageChange({ 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' });
    fixture.detectChanges();
    const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
    expect(selectedLanguage[0].textContent.trim()).toEqual('en');
  });
});
