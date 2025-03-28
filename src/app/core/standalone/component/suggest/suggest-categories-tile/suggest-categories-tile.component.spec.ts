import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';

import { SuggestCategoriesTileComponent } from './suggest-categories-tile.component';

describe('Suggest Categories Tile Component', () => {
  let component: SuggestCategoriesTileComponent;
  let fixture: ComponentFixture<SuggestCategoriesTileComponent>;
  let element: HTMLElement;
  let activatedRoute: ActivatedRoute;
  const shoppingFacade = mock(ShoppingFacade);

  beforeEach(async () => {
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
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
        images: [
          {
            effectiveUrl: 'http://domain.com/M/123.jpg',
            name: 'front M',
            primaryImage: true,
            type: 'Image',
            typeID: 'M',
            viewID: 'front',
            imageActualHeight: 270,
            imageActualWidth: 270,
          },
        ],
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
        images: [
          {
            effectiveUrl: 'http://domain.com/M/456.jpg',
            name: 'front M',
            primaryImage: true,
            type: 'Image',
            typeID: 'M',
            viewID: 'front',
            imageActualHeight: 270,
            imageActualWidth: 270,
          },
        ],
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

    when(shoppingFacade.category$('catA')).thenReturn(of({ uniqueId: 'catA', name: 'Categorya' } as CategoryView));
    when(shoppingFacade.category$('catB')).thenReturn(of({ uniqueId: 'catB', name: 'Categoryb' } as CategoryView));
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

  it('should display category names correctly', () => {
    fixture.detectChanges();
    const categoryElements = element.querySelectorAll('ul li a');
    expect(categoryElements[1].textContent).toContain('Categorya');
    expect(categoryElements[3].textContent).toContain('Categoryb');
  });

  it('should display category images correctly', () => {
    fixture.detectChanges();
    const imgElements = element.querySelectorAll('ul li img');
    expect(imgElements[0].getAttribute('src')).toBe('http://domain.com/M/123.jpg');
    expect(imgElements[1].getAttribute('src')).toBe('http://domain.com/M/456.jpg');
  });
});
