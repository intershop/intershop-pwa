import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { RecentlyFacade } from '../../facades/recently.facade';

import { RecentlyPageComponent } from './recently-page.component';

describe('Recently Page Component', () => {
  let component: RecentlyPageComponent;
  let fixture: ComponentFixture<RecentlyPageComponent>;
  let element: HTMLElement;
  let recentlyFacade: RecentlyFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    recentlyFacade = mock(RecentlyFacade);
    shoppingFacade = mock(ShoppingFacade);

    when(recentlyFacade.recentlyViewedProducts$).thenReturn(of(['sku1', 'sku2']));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(BreadcrumbComponent), MockComponent(ProductsListComponent), RecentlyPageComponent],
      providers: [
        { provide: RecentlyFacade, useFactory: () => instance(recentlyFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should trigger facade when clear button is clicked', () => {
    when(recentlyFacade.mostRecentlyViewedProducts$).thenReturn(of(['P1', 'P2', 'P3']));
    when(shoppingFacade.excludeFailedProducts$(anything())).thenReturn(of(['P1', 'P2', 'P3']));
    fixture.detectChanges();
    verify(recentlyFacade.clearRecentlyViewedProducts()).never();

    (element.querySelector('[data-testing-id="clear-all"]') as HTMLElement).click();

    verify(recentlyFacade.clearRecentlyViewedProducts()).once();
  });
});
