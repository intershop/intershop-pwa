import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { BrowserLazyViewDirective } from 'ish-core/directives/browser-lazy-view.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { RecentlyFacade } from '../../facades/recently.facade';

import { RecentlyViewedComponent } from './recently-viewed.component';

describe('Recently Viewed Component', () => {
  let fixture: ComponentFixture<RecentlyViewedComponent>;
  let component: RecentlyViewedComponent;
  let element: HTMLElement;
  let recentlyFacade: RecentlyFacade;
  let shoppingFacade: ShoppingFacade;
  let location: Location;

  beforeEach(async () => {
    recentlyFacade = mock(RecentlyFacade);
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'recently', component: RecentlyViewedComponent }])],
      declarations: [
        MockComponent(ProductsListComponent),
        MockDirective(BrowserLazyViewDirective),
        MockPipe(TranslatePipe),
        RecentlyViewedComponent,
      ],
      providers: [
        { provide: RecentlyFacade, useFactory: () => instance(recentlyFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.inject(Location);

    const directive = ngMocks.findInstance(BrowserLazyViewDirective);
    ngMocks.render(directive, directive);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when no tiles are present', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display view all link on page', () => {
    when(recentlyFacade.mostRecentlyViewedProducts$).thenReturn(of(['P1', 'P2', 'P3']));
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of(['P1', 'P2', 'P3']));
    fixture.detectChanges();
    expect(findAllDataTestingIDs(fixture)).toContain('view-all');
  });

  it('should navigate to recently page when view-all link is clicked', fakeAsync(() => {
    when(recentlyFacade.mostRecentlyViewedProducts$).thenReturn(of(['P1']));
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of(['P1']));
    fixture.detectChanges();

    expect(location.path()).toMatchInlineSnapshot(`""`);

    const link = element.querySelector('[data-testing-id="view-all"]') as HTMLLinkElement;
    link.click();
    tick(0);

    expect(location.path()).toMatchInlineSnapshot(`"/recently"`);
  }));
});
