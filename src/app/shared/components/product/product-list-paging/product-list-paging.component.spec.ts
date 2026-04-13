import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductListPagingComponent } from './product-list-paging.component';

describe('Product List Paging Component', () => {
  let component: ProductListPagingComponent;
  let fixture: ComponentFixture<ProductListPagingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPagingComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListPagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pageIndices = [
      { value: 1, display: '1' },
      { value: 2, display: '2' },
      { value: 3, display: '3' },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render adequately for starting page', () => {
    component.currentPage = 1;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="product-list-paging">
        <li><span>«</span></li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            class="active"
            >1</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >2</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >3</a
          >
        </li>
        <li class="pagination-list-next">
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >»</a
          >
        </li>
      </ul>
    `);
  });

  it('should render adequately for middle page', () => {
    component.currentPage = 2;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="product-list-paging">
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >«</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >1</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            class="active"
            >2</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >3</a
          >
        </li>
        <li class="pagination-list-next">
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >»</a
          >
        </li>
      </ul>
    `);
  });

  it('should render adequately for last page', () => {
    component.currentPage = 3;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="product-list-paging">
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >«</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >1</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >2</a
          >
        </li>
        <li>
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            class="active"
            >3</a
          >
        </li>
        <li class="pagination-list-next"><span>»</span></li>
      </ul>
    `);
  });
});
