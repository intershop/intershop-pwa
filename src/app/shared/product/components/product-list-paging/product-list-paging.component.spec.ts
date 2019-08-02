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
    component.pageIndices = [1, 2, 3];
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
      <div class="product-list-paging">
        <a class="active" ng-reflect-router-link="" href="/?page=1">1</a
        ><a ng-reflect-router-link="" href="/?page=2">2</a
        ><a ng-reflect-router-link="" href="/?page=3">3</a
        ><a ng-reflect-router-link="" href="/?page=2">»</a>
      </div>
    `);
  });

  it('should render adequately for middle page', () => {
    component.currentPage = 2;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-paging">
        <a ng-reflect-router-link="" href="/?page=1">«</a
        ><a ng-reflect-router-link="" href="/?page=1">1</a
        ><a class="active" ng-reflect-router-link="" href="/?page=2">2</a
        ><a ng-reflect-router-link="" href="/?page=3">3</a
        ><a ng-reflect-router-link="" href="/?page=3">»</a>
      </div>
    `);
  });

  it('should render adequately for last page', () => {
    component.currentPage = 3;
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-paging">
        <a ng-reflect-router-link="" href="/?page=2">«</a
        ><a ng-reflect-router-link="" href="/?page=1">1</a
        ><a ng-reflect-router-link="" href="/?page=2">2</a
        ><a class="active" ng-reflect-router-link="" href="/?page=3">3</a>
      </div>
    `);
  });
});
