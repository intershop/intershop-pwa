import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';

import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryNavigationComponent } from '../category-navigation/category-navigation.component';

import { CategoryCategoriesComponent } from './category-categories.component';

describe('Category Categories Component', () => {
  let component: CategoryCategoriesComponent;
  let fixture: ComponentFixture<CategoryCategoriesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCategoriesComponent],
      providers: [provideTranslateService()],
    })
      .overrideComponent(CategoryCategoriesComponent, {
        remove: {
          imports: [
            BreadcrumbComponent,
            CategoryListComponent,
            CategoryNavigationComponent,
            ContentViewcontextComponent,
            NgbCollapseModule,
            PaymentPaypalComponent,
            ServerSettingPipe,
            SkipContentLinkComponent,
          ],
          providers: [provideTranslateService()],
        },
        add: {
          imports: [
            MockComponent(BreadcrumbComponent),
            MockComponent(CategoryListComponent),
            MockComponent(CategoryNavigationComponent),
            MockComponent(ContentViewcontextComponent),
            MockDirective(NgbCollapse),
            MockComponent(PaymentPaypalComponent),
            MockPipe(ServerSettingPipe),
            MockComponent(SkipContentLinkComponent),
          ],
          providers: [provideTranslateService()],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCategoriesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const tree = categoryTree([
      { uniqueId: 'A', categoryPath: ['A'] },
      { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] },
      { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] },
      {
        uniqueId: 'A.1.a',
        categoryPath: ['A', 'A.1', 'A.1.a'],
      },
    ] as Category[]);

    component.category = createCategoryView(tree, 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all components on the page', () => {
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-breadcrumb']);
  });
});
