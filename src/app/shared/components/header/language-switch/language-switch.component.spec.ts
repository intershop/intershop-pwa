import { LanguageSwitchComponent } from './language-switch.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core/';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('Language Switch Component', () => {
    let fixture: ComponentFixture<LanguageSwitchComponent>,
        component: LanguageSwitchComponent,
        element: HTMLElement,
        debugEl: DebugElement,
        translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
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

    it('should check if more than 1 language options are available on the template', () => {
        fixture.detectChanges();
        const languageOptions = element.getElementsByTagName('li');
        const selectedLanguage = element.getElementsByClassName('hidden-xs');

        expect(languageOptions.length).toBeGreaterThan(1);
        expect(component.localizationArray.length).toBeGreaterThan(1);
        expect(selectedLanguage[0].textContent).toEqual('en');
    });

    it('should check language is changed when languageChange menthod is called', () => {
        component.languageChange('de');
        fixture.detectChanges();
        const selectedLanguage = element.getElementsByClassName('hidden-xs');
        expect(selectedLanguage[0].textContent).toEqual('de');
    });
});
