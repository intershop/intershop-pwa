import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let component: SearchBoxComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBoxComponent
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchBoxComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should fire event when search is called', () => {
    let term: string;
    component.searchTermChange.subscribe(searchTerm => term = searchTerm);

    component.search('test');
    expect(term).toEqual('test');
  });

  describe('with no results', () => {
    beforeEach(() => {
      component.results = [];
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('should show no results when no suggestions are found', () => {
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

      expect(ul.querySelectorAll('li').length).toBe(0);
    });

    it('should hide popup when no search results are found', () => {
      expect(component.isHide).toBe(true);
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      component.results = [
        { term: 'Cameras', type: undefined },
        { term: 'Camcorders', type: undefined },
      ];
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('should show results when suggestions are available', () => {
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

      expect(ul.querySelectorAll('li').length).toBe(2);
    });

    it('should show popup when search results are found', () => {
      expect(component.isHide).toBe(false);
    });
  });
});
