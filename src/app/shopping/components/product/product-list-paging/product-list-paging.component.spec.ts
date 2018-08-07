import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListPagingComponent } from './product-list-paging.component';

describe('Product List Paging Component', () => {
  let component: ProductListPagingComponent;
  let fixture: ComponentFixture<ProductListPagingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListPagingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListPagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pageIndices = [1, 2, 3];
    component.pageUrl = '/some/followup/link';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render adequately for starting page', () => {
    component.currentPage = 1;
    component.canRequestMore = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render adequately for middle page', () => {
    component.currentPage = 2;
    component.canRequestMore = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render adequately for last page', () => {
    component.currentPage = 3;
    component.canRequestMore = false;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });
});
