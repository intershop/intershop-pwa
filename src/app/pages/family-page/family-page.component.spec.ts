import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FamilyPageComponent } from './family-page.component';


describe('FamilyPage Component', () => {
    let fixture: ComponentFixture<FamilyPageComponent>,
        component: FamilyPageComponent,
        element: HTMLElement,
        debugEl: DebugElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FamilyPageComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(FamilyPageComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })

    it('should click list view icon and verify value of isListView to be true', () => {
        debugEl.nativeElement.querySelector('a').click();
        expect(component.isListView).toBe(true);
    })
});
