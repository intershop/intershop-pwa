import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { SearchBoxComponent } from './searchBox.component';
import { SearchBoxService } from './searchBoxService/searchBox.service';
import { tick } from '@angular/core/testing';


describe('Search Box Component', () => {
    let fixture: ComponentFixture<SearchBoxComponent>,
        component: SearchBoxComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchBoxComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchBoxComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        debugEl = fixture.debugElement;
        fixture.detectChanges();
    });

     it('search box ngOninit', fakeAsync(() => {
        component.searchTerm$.next('n');

        component.ngOnInit();
        tick(400);

        expect(component.results).not.toBeNull();
    }));

     it('search results should be blank when no suggestions are foud', fakeAsync(() => {
        component.searchTerm$.next('Test');

        component.ngOnInit();
        tick(400);

        expect(component.results).toEqual([]);
    }));

    it('search Box suggestions on template', fakeAsync(() => {
        component.results = [{
            term: 'networking software',
            type: 'SuggestTerm'
        },
        {
            term: 'netbooks',
            type: 'SuggestTerm'
        }];

        fixture.detectChanges();
        const listElements = element.getElementsByTagName('li');

        expect(listElements.length).toBeGreaterThan(0);
    }));
});
