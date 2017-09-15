import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationComponent } from './header-navigation.component';
import { CategoryService } from '../../../services/categories/category.service';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { async } from '@angular/core/testing';
import { mock, instance, when, anything, verify } from 'ts-mockito';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryModel } from '../../../services/categories/category.model';
import { SubcategoryModel } from '../../../services/categories/subcategory.model';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { GlobalState } from '../../../services/global.state';

describe('Header Navigation Component', () => {
  let fixture: ComponentFixture<HeaderNavigationComponent>;
  let component: HeaderNavigationComponent;
  let element: HTMLElement;
  let cacheCustomServiceMock: CacheCustomService;
  let categoryServiceMock: CategoryService;
  let localizeRouterServiceMock: LocalizeRouterService;
  let globalStateMock: GlobalState;

  const CategoriesMock = {
    'elements': [
      {
        'name': 'Cameras',
        'type': 'Category',
        'hasOnlineProducts': false,
        'hasOnlineSubCategories': true,
        'online': '1',
        'description': 'The cameras and camcorders products catalog.',
        'images': [
          {
            'name': 'front S',
            'type': 'Image',
            'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/4905524961133_1.jpg',
            'viewID': 'front',
            'typeID': 'S',
            'imageActualHeight': 110,
            'imageActualWidth': 110,
            'primaryImage': true
          }
        ],
        'id': 'Cameras-Camcorders',
        'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders'
      }
    ],
    'type': 'Categories'
  };

  const SubCategoriesMock = [
    {
      'name': 'Cameras',
      'type': 'Category',
      'hasOnlineProducts': false,
      'hasOnlineSubCategories': true,
      'online': '1',
      'description': 'The cameras and camcorders products catalog.',
      'subCategoriesCount': 6,
      'images': [
        {
          'name': 'front S',
          'type': 'Image',
          'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/4905524961133_1.jpg',
          'viewID': 'front',
          'typeID': 'S',
          'imageActualHeight': 110,
          'imageActualWidth': 110,
          'primaryImage': true
        }
      ],
      'id': 'Cameras-Camcorders',
      'subCategories': [
        {
          'name': 'Action Cameras',
          'type': 'Category',
          'hasOnlineProducts': true,
          'hasOnlineSubCategories': false,
          'online': '1',
          'description': 'The camera products and services catalog.',
          'images': [
            {
              'name': 'front S',
              'type': 'Image',
              'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/4548736000919_1.jpg',
              'viewID': 'front',
              'typeID': 'S',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'primaryImage': true
            }
          ],
          'id': '832',
          'uri': 'inSPIRED-inTRONICS-Site/-/categories/Cameras-Camcorders/832'
        }
      ]
    },
    {
      'name': 'Computers',
      'type': 'Category',
      'hasOnlineProducts': false,
      'hasOnlineSubCategories': true,
      'online': '1',
      'description': 'The Computers products and services catalog.',
      'subCategoriesCount': 7,
      'id': 'Computers',
      'subCategories': [
        {
          'name': 'Hardware Components',
          'type': 'Category',
          'hasOnlineProducts': false,
          'hasOnlineSubCategories': true,
          'online': '1',
          'description': 'Hardware components of computers.',
          'images': [
            {
              'name': 'front S',
              'type': 'Image',
              'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/S/7945564-3288.jpg',
              'viewID': 'front',
              'typeID': 'S',
              'imageActualHeight': 110,
              'imageActualWidth': 110,
              'primaryImage': true
            },
            {
              'name': 'front L',
              'type': 'Image',
              'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/L/7945564-3288.jpg',
              'viewID': 'front',
              'typeID': 'L',
              'imageActualHeight': 500,
              'imageActualWidth': 500,
              'primaryImage': true
            },
            {
              'name': 'front M',
              'type': 'Image',
              'effectiveUrl': '/INTERSHOP/static/WFS/inSPIRED-inTRONICS-Site/-/inSPIRED/en_US/M/7945564-3288.jpg',
              'viewID': 'front',
              'typeID': 'M',
              'imageActualHeight': 270,
              'imageActualWidth': 270,
              'primaryImage': true
            }
          ],
          'id': '106',
          'uri': 'inSPIRED-inTRONICS-Site/-/categories/Computers/106'
        }
      ]
    }
  ];


  beforeEach(async(() => {
    cacheCustomServiceMock = mock(CacheCustomService);
    // when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);


    categoryServiceMock = mock(CategoryService);
    when(categoryServiceMock.getCategories()).thenReturn(Observable.of(CategoriesMock as CategoryModel));
    when(categoryServiceMock.getSubCategories('Cameras')).thenReturn(Observable.of(SubCategoriesMock[0] as SubcategoryModel));

    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute('/category')).thenReturn('/category');
    when(localizeRouterServiceMock.translateRoute('/home')).thenReturn('/home');
    globalStateMock = mock(GlobalState);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        HeaderNavigationComponent
      ],
      providers: [
        { provide: CacheCustomService, useFactory: () => instance(cacheCustomServiceMock) },
        { provide: CategoryService, useFactory: () => instance(categoryServiceMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: GlobalState, useFactory: () => instance(globalStateMock) }
      ]
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

  it('should initialized with categories when created', () => {
    fixture.detectChanges();

    expect(component.categories).toBeTruthy();
    expect(component.categories.elements.length).toBeGreaterThan(0);
  });

  it('should render mocked category data on template', () => {
    fixture.detectChanges();
    const categories = element.getElementsByClassName('dropdown');
    expect(categories[0].children[0].textContent).toContain('Cameras');
  });

  it('should get Subcategories data from Category Service when no cache is available', () => {
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(false);
    component.getSubCategories('Cameras');

    verify(categoryServiceMock.getSubCategories(anything())).once();
    verify(cacheCustomServiceMock.getCachedData(anything())).never();
    expect(component.subCategories).toBeTruthy();
    expect(component.subCategories.subCategories.length).toBeGreaterThan(0);
  });

  it('should get Subcategories data from CacheCustom Service if available', () => {
    when(cacheCustomServiceMock.cacheKeyExists(anything())).thenReturn(true);
    when(cacheCustomServiceMock.getCachedData(anything())).thenReturn(SubCategoriesMock[0]);
    component.getSubCategories('cacheKey');
    verify(categoryServiceMock.getSubCategories(anything())).never();
    verify(cacheCustomServiceMock.getCachedData(anything())).once();
    expect(component.subCategories).toBeTruthy();
    expect(component.subCategories.subCategories.length).toBeGreaterThan(0);
  });
});

