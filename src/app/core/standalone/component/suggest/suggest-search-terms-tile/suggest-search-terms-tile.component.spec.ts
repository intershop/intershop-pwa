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
      imports: [SuggestSearchTermsTileComponent, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestSearchTermsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.maxRecentlySearchedWords = 2;
    recentlySearchTerms$.next(['term1', 'term2', 'term3']);
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
});
