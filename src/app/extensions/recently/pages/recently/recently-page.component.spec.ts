import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';

import { RecentlyFacade } from '../../facades/recently.facade';

import { RecentlyPageComponent } from './recently-page.component';

describe('Recently Page Component', () => {
  let component: RecentlyPageComponent;
  let fixture: ComponentFixture<RecentlyPageComponent>;
  let element: HTMLElement;
  let recentlyFacade: RecentlyFacade;

  beforeEach(async () => {
    recentlyFacade = mock(RecentlyFacade);
    when(recentlyFacade.recentlyViewedProducts$).thenReturn(of(['sku1', 'sku2']));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(BreadcrumbComponent), MockDirective(ProductContextDirective), RecentlyPageComponent],
      providers: [{ provide: RecentlyFacade, useFactory: () => instance(recentlyFacade) }],
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

  it('should display product items for recently used products', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-product-item')).toHaveLength(2);
  });

  it('should trigger facade when clear button is clicked', () => {
    fixture.detectChanges();
    verify(recentlyFacade.clearRecentlyViewedProducts()).never();

    (element.querySelector('[data-testing-id="clear-all"]') as HTMLElement).click();

    verify(recentlyFacade.clearRecentlyViewedProducts()).once();
  });
});
