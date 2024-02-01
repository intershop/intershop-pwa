import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductListPagingComponent } from './product-list-paging.component';

describe('Product List Paging Component', () => {
  let component: ProductListPagingComponent;
  let fixture: ComponentFixture<ProductListPagingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductListPagingComponent],
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
        <li>«</li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            class="active"
          >
            1
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            2
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            3
          </button>
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
          <button
            queryparamshandling="merge"
            class="product-list-paging-previous"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            «
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            1
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            class="active"
          >
            2
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            3
          </button>
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
          <button
            queryparamshandling="merge"
            class="product-list-paging-previous"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            «
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            1
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
          >
            2
          </button>
        </li>
        <li>
          <button
            queryparamshandling="merge"
            tabindex="0"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            class="active"
          >
            3
          </button>
        </li>
        <li class="pagination-list-next">»</li>
      </ul>
    `);
  });
});
