import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { WishListPageComponent } from './wish-list-page.component';

describe('Wish list Page Component', () => {
    let fixture: ComponentFixture<WishListPageComponent>,
        component: WishListPageComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WishListPageComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(WishListPageComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            debugEl = fixture.debugElement;
        });
    }));

    it('should check if "Add to Wishlist" button is rendered', () => {
        const anchorTag = element.querySelector('.btn-default');
        expect(anchorTag).toBeDefined();
    });

    it('should check if input fields are rendered on HTML', () => {
        const inputFields = element.getElementsByClassName('form-control');
        expect(inputFields.length).toBe(3);
        expect(inputFields[0]).toBeDefined();
        expect(inputFields[1]).toBeDefined();
        expect(inputFields[2]).toBeDefined();
    });
});
