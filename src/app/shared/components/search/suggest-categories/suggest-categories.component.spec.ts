import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { SuggestCategoriesTileComponent } from 'ish-shared/components/search/suggest-categories-tile/suggest-categories-tile.component';

import { SuggestCategoriesComponent } from './suggest-categories.component';

describe('Suggest Categories Component', () => {
  let component: SuggestCategoriesComponent;
  let fixture: ComponentFixture<SuggestCategoriesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(SuggestCategoriesTileComponent), SuggestCategoriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestCategoriesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categories = ['catA', 'catB', 'catC', 'catD'];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number (maxAutoSuggests = 2) of category suggestions', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-suggest-categories-tile",
        "ish-suggest-categories-tile",
      ]
    `);
  });
});
