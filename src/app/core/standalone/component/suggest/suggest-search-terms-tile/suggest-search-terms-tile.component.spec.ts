import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { SuggestSearchTermsTileComponent } from './suggest-search-terms-tile.component';

describe('Suggest Search Terms Tile Component', () => {
  let component: SuggestSearchTermsTileComponent;
  let fixture: ComponentFixture<SuggestSearchTermsTileComponent>;
  let element: HTMLElement;
  const shoppingFacade = mock(ShoppingFacade);
  const recentlySearchTerms$ = new BehaviorSubject<string[]>([]);

  beforeEach(async () => {
    when(shoppingFacade.recentlySearchTerms$).thenReturn(recentlySearchTerms$);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestSearchTermsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.maxRecentlySearchedWords = 2;
    recentlySearchTerms$.next(['Term1', 'Term2', 'Term3']);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of saved terms', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('button')).toHaveLength(2);
  });

  it('should display saved term names correctly', () => {
    fixture.detectChanges();
    const savedTermElements = element.querySelectorAll('ul li button');
    expect(savedTermElements[0].textContent).toContain('Term1');
    expect(savedTermElements[1].textContent).toContain('Term2');
  });
});
