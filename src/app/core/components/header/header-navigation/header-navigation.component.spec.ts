import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let categoriesServiceMock: CategoriesService;
  let currentLocaleServiceMock$: BehaviorSubject<any>;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anything())).thenReturn(of([]));

    currentLocaleServiceMock$ = new BehaviorSubject({ dummy: null });

    TestBed.configureTestingModule({
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CurrentLocaleService, useValue: currentLocaleServiceMock$ }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should retrieve categories when created', () => {
    verify(categoriesServiceMock.getTopLevelCategories(anything())).never();
    fixture.detectChanges();
    verify(categoriesServiceMock.getTopLevelCategories(anything())).once();
  });
});
