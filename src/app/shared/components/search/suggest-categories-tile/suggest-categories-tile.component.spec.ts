import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryImageComponent } from 'ish-shared/components/category/category-image/category-image.component';

import { SuggestCategoriesTileComponent } from './suggest-categories-tile.component';

describe('Suggest Categories Tile Component', () => {
  let component: SuggestCategoriesTileComponent;
  let fixture: ComponentFixture<SuggestCategoriesTileComponent>;
  let element: HTMLElement;
  const shoppingFacade = mock(ShoppingFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
      declarations: [MockComponent(CategoryImageComponent), SuggestCategoriesTileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestCategoriesTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categoryUniqueId = 'catA';
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');

    when(shoppingFacade.category$('catA')).thenReturn(of({ uniqueId: 'catA', name: 'Category A' } as CategoryView));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display category names correctly', () => {
    fixture.detectChanges();
    const categoryElements = element.querySelectorAll('li a');
    expect(categoryElements[1].textContent).toMatchInlineSnapshot(`"Category A"`);
  });
});
