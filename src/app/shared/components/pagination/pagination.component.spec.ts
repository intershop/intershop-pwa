import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('Pagination Component', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [PaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not be rendered if there are not enough items', () => {
    component.pageSize = 25;
    component.totalItems = 20;
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id="pagination-container"]')).toBeFalsy();
  });

  it('should be rendered if there are enough items', () => {
    component.pageSize = 25;
    component.totalItems = 100;
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id="pagination-container"]')).toBeTruthy();
  });

  it('should disable previous page button on first page', () => {
    component.pageSize = 25;
    component.totalItems = 50;
    component.pageNumber = 1;
    fixture.detectChanges();
    const previousPageButton: HTMLButtonElement = element.querySelector('[data-testing-id="previous-page-button"]');
    expect(previousPageButton.disabled).toBeTruthy();
  });

  it('should enable previous page button when not on first page', () => {
    component.pageSize = 25;
    component.totalItems = 100;
    component.pageNumber = 2;
    fixture.detectChanges();
    const previousPageButton: HTMLButtonElement = element.querySelector('[data-testing-id="previous-page-button"]');
    expect(previousPageButton.disabled).toBeFalsy();
  });

  it('should disable next page button on last page', () => {
    component.pageSize = 25;
    component.totalItems = 50;
    component.numPages = Math.ceil(component.totalItems / component.pageSize);
    component.pageNumber = component.numPages;
    fixture.detectChanges();
    const nextPageButton: HTMLButtonElement = element.querySelector('[data-testing-id="next-page-button"]');
    expect(nextPageButton.disabled).toBeTruthy();
  });

  it('should enable next page button when not on last page', () => {
    component.pageSize = 25;
    component.totalItems = 100;
    component.pageNumber = 2;
    fixture.detectChanges();
    const nextPageButton: HTMLButtonElement = element.querySelector('[data-testing-id="next-page-button"]');
    expect(nextPageButton.disabled).toBeFalsy();
  });
});
