import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { SearchBoxComponent } from './search-box.component';
import { SearchBoxService } from './search-box-service/search-box.service';
import { tick, async } from '@angular/core/testing';


describe('Search Box Component', () => {
    let fixture: ComponentFixture<SearchBoxComponent>,
        component: SearchBoxComponent,
        element: HTMLElement,
        debugEl: DebugElement,
        resultRequired = true;

    class SearchBoxServiceStub {
        search(term) {
            const result = {
                'elements': [
                    'Camera', 'Camcoder'
                ]
            }

            return resultRequired ? Observable.of(result) : Observable.of(null);
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchBoxComponent
            ],
            providers: [{ provide: SearchBoxService, useClass: SearchBoxServiceStub }]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchBoxComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            debugEl = fixture.debugElement;
            fixture.detectChanges();
        });
    }));

    it('search box ngOninit', fakeAsync(() => {
        component.searchTerm$.next('c');

        component.ngOnInit();
        tick(400);

        expect(component.results).not.toBeNull();
    }));

    it('search results should be blank when no suggestions are found', fakeAsync(() => {
        resultRequired = false;
        component.searchTerm$.next('Test');

        component.ngOnInit();
        tick(400);

        expect(component.results).toEqual([]);
    }));

    it('should call hidePopeup method', fakeAsync(() => {
        component.results = []
        component.hidePopuep();
        expect(component.isHide).toBe(true);
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
