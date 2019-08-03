import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductListPagingComponent } from './product-list-paging.component';

describe('Product List Paging Component', () => {
  let component: ProductListPagingComponent;
  let fixture: ComponentFixture<ProductListPagingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductListPagingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListPagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pageIndices = [{ value: 1, display: '1' }, { value: 2, display: '2' }, { value: 3, display: '3' }];
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
      <div class="product-list-paging row justify-content-center">
        <a class=" col-1 inactive">«</a>
        <div class="col-auto">
          <a
            queryparamshandling="merge"
            class="active"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >1</a
          ><a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >2</a
          ><a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >3</a
          >
        </div>
        <a
          class="col-1"
          queryparamshandling="merge"
          ng-reflect-query-params-handling="merge"
          ng-reflect-router-link=""
          href="/?page=2"
          >»</a
        >
      </div>
    `);
  });

  it('should render adequately for middle page', () => {
    component.currentPage = 2;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-paging row justify-content-center">
        <a
          class="col-1"
          queryparamshandling="merge"
          ng-reflect-query-params-handling="merge"
          ng-reflect-router-link=""
          href="/?page=1"
          >«</a
        >
        <div class="col-auto">
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >1</a
          ><a
            queryparamshandling="merge"
            class="active"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >2</a
          ><a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >3</a
          >
        </div>
        <a
          class="col-1"
          queryparamshandling="merge"
          ng-reflect-query-params-handling="merge"
          ng-reflect-router-link=""
          href="/?page=3"
          >»</a
        >
      </div>
    `);
  });

  it('should render adequately for last page', () => {
    component.currentPage = 3;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-paging row justify-content-center">
        <a
          class="col-1"
          queryparamshandling="merge"
          ng-reflect-query-params-handling="merge"
          ng-reflect-router-link=""
          href="/?page=2"
          >«</a
        >
        <div class="col-auto">
          <a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=1"
            >1</a
          ><a
            queryparamshandling="merge"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=2"
            >2</a
          ><a
            queryparamshandling="merge"
            class="active"
            ng-reflect-query-params-handling="merge"
            ng-reflect-router-link=""
            href="/?page=3"
            >3</a
          >
        </div>
        <a class="col-1 inactive">»</a>
      </div>
    `);
  });
});
