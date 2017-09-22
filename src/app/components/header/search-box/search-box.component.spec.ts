import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { async, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SearchBoxService } from '../../../services/suggest/search-box.service';
import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
    let fixture: ComponentFixture<SearchBoxComponent>;
    let component: SearchBoxComponent;
    let element: HTMLElement;
    let resultRequired: boolean;

    class SearchBoxServiceStub {
        search(term) {
            const result = {
                'elements': [
                    'Camera', 'Camcoder'
                ]
            };

            return resultRequired ? Observable.of(result) : Observable.of(null);
        }
    }

    beforeEach(async(() => {
        resultRequired = true;
        TestBed.configureTestingModule({
            declarations: [
                SearchBoxComponent
            ],
            imports: [TranslateModule.forRoot()],
            providers: [{ provide: SearchBoxService, useClass: SearchBoxServiceStub }]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SearchBoxComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            fixture.detectChanges();
        });
    }));

    it('should create the component', async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should call search method of searchBox service and verify that it returns data when suggestions are available', fakeAsync(() => {
        component.searchTerm$.next('c');
        component.doSearch();
        tick(400);
        expect(component.results).not.toBeNull();
    }));

    it('should call search method of searchBox service and verify that search results should be a blank array when no suggestions are found', fakeAsync(() => {
        resultRequired = false;
        component.searchTerm$.next('Test');

        component.doSearch();
        tick(400);

        expect(component.results).toEqual([]);
    }));

    it('should call hidePopeup method and expect isHide to be true', fakeAsync(() => {
        component.results = [];
        component.hidePopup();
        expect(component.isHide).toBe(true);
    }));

    it('should check if both the search results are rendered on HTML', fakeAsync(() => {
        component.results = [{
            term: 'networking software',
            type: 'SuggestTerm'
        },
        {
            term: 'netbooks',
            type: 'SuggestTerm'
        }];

        fixture.detectChanges();
        const listElements = element.getElementsByClassName('search-suggest-results');
        expect(listElements[0].children.length).toEqual(2);
    }));
});
