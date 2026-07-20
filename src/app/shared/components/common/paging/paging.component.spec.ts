import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { PagingComponent } from './paging.component';

window.scrollTo = jest.fn();

describe('Paging Component', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.deviceType$).thenReturn(of('desktop'));

    await TestBed.configureTestingModule({
      imports: [NgbPaginationModule, TranslatePipe],
      declarations: [PagingComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.currentPage = 1;
    component.lastPage = 10;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render an ngb-pagination with the current page marked active', () => {
    component.currentPage = 3;
    fixture.detectChanges();

    expect(element.querySelector('ngb-pagination')).toBeTruthy();
    expect(element.querySelector('.page-item.active .page-link')?.textContent?.trim()).toBe('3');
  });

  it('should disable the previous button on the first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();

    const items = element.querySelectorAll('.pagination .page-item');
    expect(items[0].classList).toContain('disabled');
    expect(items[items.length - 1].classList).not.toContain('disabled');
  });

  it('should disable the next button on the last page', () => {
    component.currentPage = 10;
    fixture.detectChanges();

    const items = element.querySelectorAll('.pagination .page-item');
    expect(items[0].classList).not.toContain('disabled');
    expect(items[items.length - 1].classList).toContain('disabled');
  });

  it('should emit goToPage with the requested page when setPage is called', () => {
    const emitter = spy(component.goToPage);

    component.setPage(2);

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`2`);
  });
});
