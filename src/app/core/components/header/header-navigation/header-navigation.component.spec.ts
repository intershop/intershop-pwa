import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { CategoriesService } from '../../../services/categories/categories.service';
import { CoreState } from '../../../store/core.state';
import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let categoriesServiceMock: CategoriesService;
  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anything())).thenReturn(of([]));

    storeMock = mock(Store);
    when(storeMock.pipe(anything())).thenReturn(of({}) as any);

    TestBed.configureTestingModule({
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: Store, useFactory: () => instance(storeMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should retrieve categories when created', () => {
    verify(categoriesServiceMock.getTopLevelCategories(anything())).never();
    fixture.detectChanges();
    verify(categoriesServiceMock.getTopLevelCategories(anything())).once();
  });
});
