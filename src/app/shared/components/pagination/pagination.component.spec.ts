import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from './pagination.component';

describe('Pagination Component', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
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

  it('should trigger pageChange event when click next and previous button', () => {
    component.pageChanged.subscribe((data: any) => {
      expect(data).toEqual({
        currentPage: 1,
        itemsPerPage: component.itemsPerPage
      });
      component.selectPage(1);
    });
  });

  it('should not show next button when current page equal to totalpages', () => {
    component.currentPage = 3;
    fixture.detectChanges();
    expect(element.querySelector('.kor-control-next')).toBeFalsy();
  });

  it('should not show previous button when current page equal to first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    expect(element.querySelector('.kor-control-previous')).toBeFalsy();
  });
});
