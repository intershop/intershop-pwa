import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProductComparePagingComponent } from './product-compare-paging.component';

describe('Product Compare Paging Component', () => {
  let component: ProductComparePagingComponent;
  let fixture: ComponentFixture<ProductComparePagingComponent>;
  let element: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductComparePagingComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComparePagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.totalItems = 5;
    component.itemsPerPage = 2;
    component.currentPage = 2;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should trigger changePage event when click next and previous button', () => {
    const expected = 1;
    let called = false;
    component.changePage.subscribe(data => {
      expect(data).toEqual(expected);
      called = true;
    });
    component.changeToPage(expected);
    expect(called).toBeTruthy();
  });

  it('should not show next button when current page equal to totalpages', () => {
    component.currentPage = 3;
    fixture.detectChanges();
    expect(element.querySelector('.control-next')).toBeFalsy();
  });

  it('should not show previous button when current page equal to first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    expect(element.querySelector('.control-previous')).toBeFalsy();
  });
});
