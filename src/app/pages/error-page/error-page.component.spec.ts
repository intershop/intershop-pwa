import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ErrorPageComponent } from './error-page.component';


describe('ErrorPage Component', () => {
    let fixture: ComponentFixture<ErrorPageComponent>,
        component: ErrorPageComponent,
        element: HTMLElement,
        debugEl: DebugElement;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorPageComponent]
        })
            .compileComponents()
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorPageComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should test if tags with their text are getting rendered on the HTML', () => {
        expect(element.getElementsByTagName('h3')[0].textContent).toContain('We are sorry');
        expect(element.getElementsByTagName('p')[0].textContent).toContain('The page you are looking for is currently not available');
        expect(element.getElementsByTagName('h4')[0].textContent).toContain('Please try one of the following:');
        expect(element.getElementsByClassName('btn-primary')[0].textContent).toContain('Search');
    });
});
