import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { CategoriesService } from '../../../services/categories/categories.service';
import { HeaderNavigationComponent } from './header-navigation.component';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let categoriesServiceMock: CategoriesService;

  beforeEach(async(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anything())).thenReturn(of([]));

    TestBed.configureTestingModule({
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) }
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
});
