import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { async, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { SuggestService } from '../../../../shared/services/suggest/suggest.service';
import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let component: SearchBoxComponent;
  let element: HTMLElement;
  const mockSuggestService: SuggestService = mock(SuggestService);
  when(mockSuggestService.search(anything())).thenCall(() => {
    const result = {
      'elements': [
        'Camera', 'Camcoder'
      ]
    };
    return Observable.of(result);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBoxComponent
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: SuggestService, useFactory: () => instance(mockSuggestService) }]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchBoxComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });
  }));

  it('should be created', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should set result array when suggestions are available', fakeAsync(() => {
    component.searchTerm$.next('c');
    component.doSearch();
    tick(400);
    expect(component.results).not.toBeNull();
  }));

  it('should set result array to blank when no suggestions are found', fakeAsync(() => {
    when(mockSuggestService.search(anything())).thenReturn(Observable.of([]));
    component.searchTerm$.next('Test');

    component.doSearch();
    tick(400);

    expect(component.results).toEqual([]);
  }));

  it('should hide popup when no search results are found', fakeAsync(() => {
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
