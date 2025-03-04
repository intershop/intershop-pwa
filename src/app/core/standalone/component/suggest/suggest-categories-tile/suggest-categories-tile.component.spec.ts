import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { SuggestCategoriesTileComponent } from './suggest-categories-tile.component';

describe('Suggest Categories Tile Component', () => {
  let component: SuggestCategoriesTileComponent;
  let fixture: ComponentFixture<SuggestCategoriesTileComponent>;
  let element: HTMLElement;
  const shoppingFacade = mock(ShoppingFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestCategoriesTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categories = [
      {
        uniqueId: 'catA',
        name: 'Categorya',
        images: [],
        categoryRef: '',
        categoryPath: [],
        hasOnlineProducts: false,
        description: '',
        attributes: [],
        completenessLevel: 0,
      },
      {
        uniqueId: 'catB',
        name: 'Categoryb',
        images: [],
        categoryRef: '',
        categoryPath: [],
        hasOnlineProducts: false,
        description: '',
        attributes: [],
        completenessLevel: 0,
      },
    ];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of category suggestions', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ul li')).toHaveLength(2);
  });
});
