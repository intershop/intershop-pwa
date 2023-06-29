import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

import { SubCategoryNavigationComponent } from './sub-category-navigation.component';

describe('Sub Category Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);

    when(shoppingFacade.navigationCategories$('A')).thenReturn(
      of([
        { uniqueId: 'A.1', name: 'CAT_A1', url: '/CAT_A1-catA.1', hasChildren: true },
        { uniqueId: 'A.2', name: 'CAT_A2', url: '/CAT_A2-catA.2' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1')).thenReturn(
      of([{ uniqueId: 'A.1.a', name: 'CAT_A1a', url: '/CAT_A1a-catA.1.a', hasChildren: true }] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1.a')).thenReturn(
      of([
        { uniqueId: 'A.1.a.alpha', name: 'CAT_A1aAlpha', url: '/CAT_A1aAlpha-catA.1.a.alpha' },
      ] as NavigationCategory[])
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), SubCategoryNavigationComponent],
      providers: [
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 2 },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categoryUniqueId = 'A';
    component.subCategoriesDepth = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('a[href="/CAT_A1-catA.1"]').textContent).toContain('CAT_A1');
    expect(element.querySelector('ish-sub-category-navigation')).toBeTruthy();
    expect(element.querySelector('a[href="/CAT_A1a-catA.1.a"]').textContent).toContain('CAT_A1a');
    expect(element.querySelector('a[href="/CAT_A2-catA.2"]').textContent).toContain('CAT_A2');
  });
});
