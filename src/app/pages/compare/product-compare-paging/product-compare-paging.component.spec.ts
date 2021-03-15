import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, spy, verify } from 'ts-mockito';

import { ProductComparePagingComponent } from './product-compare-paging.component';

describe('Product Compare Paging Component', () => {
  let component: ProductComparePagingComponent;
  let fixture: ComponentFixture<ProductComparePagingComponent>;
  let element: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComparePagingComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

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
    const emitter = spy(component.changePage);

    component.changeToPage(1);

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`1`);
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
