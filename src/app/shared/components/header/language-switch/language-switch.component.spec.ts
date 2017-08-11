import { LanguageSwitchComponent } from './language-switch.component';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core/';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';

describe('Language Switch Component', () => {
    let fixture: ComponentFixture<LanguageSwitchComponent>,
        component: LanguageSwitchComponent,
        element: HTMLElement,
        debugEl: DebugElement,
        translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
              TranslateModule.forRoot(),
              BsDropdownModule.forRoot()
            ],
            declarations: [LanguageSwitchComponent],
            providers: [TranslateService]
        }).compileComponents();

        translateService = TestBed.get(TranslateService);
        translateService.setDefaultLang('en');
        translateService.use('en');
        fixture = TestBed.createComponent(LanguageSwitchComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check if more than 1 language options are available on the template', fakeAsync(() => {
      fixture.detectChanges(); // update the view
      fixture.nativeElement.querySelectorAll('[dropdownToggle]')[0].click(); // trigger drop down opening
      tick(); // wait for async tasks to end
      fixture.detectChanges(); // update the view
      const languageOptions = element.getElementsByTagName('li');
      expect(languageOptions.length).toBeGreaterThan(1);

      expect(component.localizationArray.length).toBeGreaterThan(1);

      const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
      expect(selectedLanguage[0].textContent.trim()).toEqual('en');
    }));

    it('should check language is changed when languageChange menthod is called', () => {
        component.languageChange('de');
        fixture.detectChanges();
        const selectedLanguage = element.getElementsByClassName('language-switch-current-selection');
        expect(selectedLanguage[0].textContent.trim()).toEqual('de');
    });
});
