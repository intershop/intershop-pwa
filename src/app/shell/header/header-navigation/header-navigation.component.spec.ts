import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { LazyContentIncludeComponent } from 'ish-shell/shared/lazy-content-include/lazy-content-include.component';

import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let component: HeaderNavigationComponent;
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [HeaderNavigationComponent, MockComponent(LazyContentIncludeComponent)],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const categories = [
      { uniqueId: 'A', name: 'CAT_A', url: '/cat/A', hasChildren: true },
      { uniqueId: 'B', name: 'CAT_B', url: '/cat/B' },
      { uniqueId: 'C', name: 'CAT_C', url: '/cat/C' },
    ] as NavigationCategory[];
    when(shoppingFacade.navigationCategories$()).thenReturn(of(categories));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="navbar-nav main-navigation-list">
        <ish-lazy-content-include
          includeid="include.header.navigation.pagelet2-Include"
          role="listitem"
          ng-reflect-include-id="include.header.navigation.page"
        ></ish-lazy-content-include>
      </ul>
    `);
  });
});
