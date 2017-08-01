import { LanguageSwitchComponent } from './languageSwitch.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core/';

describe('HeaderNavigationService', () => {
    let fixture: ComponentFixture<LanguageSwitchComponent>,
        component: LanguageSwitchComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [LanguageSwitchComponent],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(LanguageSwitchComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check if Language German is rendered on template', () => {
        const langauageSwitchMenu = element.getElementsByClassName('language-switch-menu-container');

        expect(langauageSwitchMenu[0].children[0].children[0].textContent).toEqual('German');
    });
});
