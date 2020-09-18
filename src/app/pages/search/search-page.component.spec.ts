import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';

import { SearchNoResultComponent } from './search-no-result/search-no-result.component';
import { SearchPageComponent } from './search-page.component';
import { SearchResultComponent } from './search-result/search-result.component';

describe('Search Page Component', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.searchTerm$).thenReturn(of('search'));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(SearchNoResultComponent),
        MockComponent(SearchResultComponent),
        SearchPageComponent,
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    when(shoppingFacade.searchItemsCount$).thenReturn(of(0));
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render search no result component if search has no results', () => {
    when(shoppingFacade.searchItemsCount$).thenReturn(of(0));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-breadcrumb",
        "ish-search-no-result",
      ]
    `);
  });

  it('should render search result component if search has results', () => {
    when(shoppingFacade.searchItemsCount$).thenReturn(of(1));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-search-result",
      ]
    `);
  });
});
