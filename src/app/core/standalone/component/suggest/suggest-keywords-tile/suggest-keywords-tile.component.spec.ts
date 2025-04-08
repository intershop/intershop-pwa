import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SuggestKeywordsTileComponent } from './suggest-keywords-tile.component';

describe('Suggest Keywords Tile Component', () => {
  let component: SuggestKeywordsTileComponent;
  let fixture: ComponentFixture<SuggestKeywordsTileComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestKeywordsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.keywords = ['Test1', 'Test2', 'Test3'];
    component.maxAutoSuggests = 2;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of suggestions', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('button')).toHaveLength(2);
  });

  it('should display keyword names correctly', () => {
    fixture.detectChanges();
    const keywordElements = element.querySelectorAll('ul li button');
    expect(keywordElements[0].textContent).toContain('Test1');
    expect(keywordElements[1].textContent).toContain('Test2');
  });
});
