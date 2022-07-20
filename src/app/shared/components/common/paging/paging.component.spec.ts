import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { PagingComponent } from './paging.component';

describe('Paging Component', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(FaIconComponent), PagingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.currentPage = 1;
    component.lastPage = 10;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display paging navigation links if current page = 1', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(JSON.stringify(component.pageIndices)).toMatchInlineSnapshot(`"[1,2,3,4,5,6,-1,10]"`);
    expect(element.querySelectorAll('button.btn')).toHaveLength(2);
    expect(element.querySelectorAll('[data-testing-id=paging-link] a')).toHaveLength(7);
    expect(element.innerHTML).toContain('...');
  });

  it('should display paging navigation links if current page = last page', () => {
    component.currentPage = 10;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(JSON.stringify(component.pageIndices)).toMatchInlineSnapshot(`"[1,-1,5,6,7,8,9,10]"`);
    expect(element.querySelectorAll('button.btn')).toHaveLength(2);
    expect(element.querySelectorAll('[data-testing-id=paging-link] a')).toHaveLength(7);
    expect(element.innerHTML).toContain('...');
  });

  it('should display paging navigation links if current page is in the center', () => {
    component.currentPage = 5;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(JSON.stringify(component.pageIndices)).toMatchInlineSnapshot(`"[1,-1,3,4,5,6,7,-1,10]"`);
    expect(element.querySelectorAll('[data-testing-id=paging-link] a')).toHaveLength(7);
    expect(element.innerHTML).toContain('...');
  });

  it('should navigate to the next page if the next button is clicked', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    const emitter = spy(component.goToPage);

    (element.querySelector('button[data-testing-id="paging-next-button"]') as HTMLElement).click();

    verify(emitter.emit(2)).once();
  });

  it('should navigate to the previous page if the previous button is clicked', () => {
    component.currentPage = 5;
    component.ngOnChanges();
    fixture.detectChanges();

    const emitter = spy(component.goToPage);

    (element.querySelector('button[data-testing-id="paging-previous-button"]') as HTMLElement).click();

    verify(emitter.emit(4)).once();
  });
});
