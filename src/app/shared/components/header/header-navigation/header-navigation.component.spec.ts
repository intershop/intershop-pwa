import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { HeaderNavigationService } from './header-navigation-service/header-navigation.service';

describe('Header Slot Component', () => {
    let fixture: ComponentFixture<HeaderNavigationComponent>,
        component: HeaderNavigationComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderNavigationComponent
            ],
            providers: [HeaderNavigationService]
        });

        fixture = TestBed.createComponent(HeaderNavigationComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should set values data to categories and subcategories', () => {
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.categories).not.toBeNull();
        expect(component.subCategories).not.toBeNull();
    });

    it('should render categories and subcategories on template', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const categories = element.getElementsByTagName('b');
        const subCategories = element.getElementsByClassName('main-navigation-level1-item');

        expect(categories[0].innerText).toEqual('CAMERAS');
        expect(categories[1].innerText).toEqual('COMPUTERS');
        expect(categories[2].innerText).toEqual('TELECOMMUNICATION');
        expect(categories[3].innerText).toEqual('SPECIALS');

        expect(subCategories[0].children[0].textContent).toEqual('Binoculars');
        expect(subCategories[1].children[0].textContent).toEqual('Camera Accessories & Supplies');
        expect(subCategories[2].children[0].textContent).toEqual('Camera Backpacks & Cases');
    });
});
