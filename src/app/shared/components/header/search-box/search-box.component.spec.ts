import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { SearchBoxComponent } from './search-box.component';
import { SearchBoxService } from './search-box-service/search-box.service';
import { tick, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';


describe('Search Box Component', () => {
    let fixture: ComponentFixture<SearchBoxComponent>,
        component: SearchBoxComponent,
        element: HTMLElement,
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
        component.ngOnInit();
        tick(400);
        console.log(component.results);
        expect(component.results).not.toBeNull();
    }));

    it('should call search method of searchBox service and verify that search results should be a blank array when no suggestions are found', fakeAsync(() => {
        resultRequired = false;
        component.searchTerm$.next('Test');

        component.ngOnInit();
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
