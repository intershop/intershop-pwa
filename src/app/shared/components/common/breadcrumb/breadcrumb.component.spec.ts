import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('Breadcrumb Component', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('search.breadcrumbs.your_search.label', 'Search Results:');
    translate.set('account.my_account.link', 'My Account');
    translate.set('account.order_history.link', 'Orders');
    translate.set('common.home.link', 'Home');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('breadcrumbtrail from property trail', () => {
    it('should render trail from home and trail with translation keys if set', () => {
      component.trail = [{ key: 'KEY' }, { key: 'KEY2' }];
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/KEY/KEY2"`);
    });

    it('should render trail from home and trail with text if set', () => {
      component.trail = [{ text: 'TEXT' }, { text: 'TEXT2' }];
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/TEXT/TEXT2"`);
    });

    it('should render trail from home and with link if set', () => {
      component.trail = [{ link: '/LINK', text: 'L1' }, { link: '/LINK', text: 'L2' }];
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/L1/L2"`);
    });
  });

  describe('breadcrumbtrail from category', () => {
    const cat1 = {
      uniqueId: '123',
      categoryPath: ['123'],
      name: 'cat123',
    } as Category;
    const cat11 = {
      uniqueId: '123.456',
      categoryPath: ['123', '123.456'],
      name: 'cat456',
    } as Category;
    const tree = categoryTree([cat1, cat11]);
    const view = createCategoryView(tree, '123.456');

    it('should render breadcrumbtrail from home and category when available', () => {
      component.category = view;
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/cat123/cat456"`);
    });
    it('should render breadcrumbtrail from category when available', () => {
      component.showHome = false;
      component.category = view;
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"cat123/cat456"`);
    });
  });

  describe('breadcrumbtrail from category of product', () => {
    const cat1 = {
      uniqueId: '1',
      categoryPath: ['1'],
      name: 'n1',
    } as Category;
    const cat11 = {
      uniqueId: '1.2',
      categoryPath: ['1', '1.2'],
      name: 'n2',
    } as Category;
    const tree = categoryTree([cat1, cat11]);

    it('should render breadcrumbtrail from home and category of product when category of product is available', () => {
      const product = {
        name: 'FakeProduct',
        sku: '01234567',
        defaultCategoryId: '1.2',
      } as Product;
      const view = createProductView(product, tree);
      component.product = view;
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/n1/n2/FakeProduct"`);
    });
  });

  describe('breadcrumbtrail from product name', () => {
    it('should render breadcrumbtrail from product name of product when product is available', () => {
      const productName = 'FakeProduct';
      component.showHome = false;
      const product = {
        name: productName,
        sku: '01234567',
      } as Product;
      const view = createProductView(product, categoryTree());
      component.product = view;
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"FakeProduct"`);
    });
  });

  describe('breadcrumbtrail from account', () => {
    it('should render breadcrumbtrail from account and trail when account is active', () => {
      component.showHome = false;
      component.account = true;
      component.trail = [{ key: 'account.order_history.link' }];
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"My Account/Orders"`);
    });

    it('should render breadcrumbtrail from home and account and trail when account is active', () => {
      component.account = true;
      component.trail = [{ key: 'account.order_history.link' }];
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/My Account/Orders"`);
      expect(element.textContent).toContain('My Account');
    });
  });

  describe('breadcrumbtrail from search term', () => {
    it('should render trail from search term when is available', () => {
      component.showHome = false;
      component.searchTerm = 'Test Search Term';

      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Search Results: Test Search Term"`);
    });

    it('should render trail from home and search term when search term is available', () => {
      component.searchTerm = 'Test Search Term';
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/Search Results: Test Search Term"`);
    });

    it('should render home only by default if nothing else is available', () => {
      fixture.detectChanges();
      expect(element.textContent).toMatchInlineSnapshot(`"Home/"`);
    });
  });
});
