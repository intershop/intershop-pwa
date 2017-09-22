import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Observable } from 'rxjs/Rx';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { CacheCustomService } from '../../services/index';
import { FilterListService } from './filter-list-service/index';
import { FilterListComponent } from './filter-list.component';

describe('FilterList Component', () => {
  let fixture: ComponentFixture<FilterListComponent>;
  let component: FilterListComponent;
  let element: HTMLElement;
  let cacheCustomService: CacheCustomService;
  let filterListService: FilterListService;
  const filterData = {
    'elements': [
      {
        'name': 'Category',
        'type': 'SearchIndexFilter',
        'id': 'CategoryUUIDLevelMulti',
        'facets': [
          {
            'name': 'Cameras',
            'type': 'Facet',
            'count': 75,
            'link': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPUpkUUtBQjFVbEh3QUFBRmRCVXdpMGxuNCZPbmxpbmVGbGFnPTE=',
              'title': 'Cameras'
            },
            'selected': false,
            'hits': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/CategoryUUIDLevelMulti;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPUpkUUtBQjFVbEh3QUFBRmRCVXdpMGxuNCZPbmxpbmVGbGFnPTE=/hits',
              'title': 'Cameras'
            }
          }
        ],
        'displayType': 'text_clear',
        'selectionType': 'taxonomic',
        'limitCount': -1,
        'minCount': 1,
        'scope': 'Global'
      },
      {
        'name': 'Brand',
        'type': 'SearchIndexFilter',
        'id': 'ManufacturerName',
        'facets': [
          {
            'name': 'Camcorders',
            'type': 'Facet',
            'count': 149,
            'link': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZNYW51ZmFjdHVyZXJOYW1lPUEtREFUQSZPbmxpbmVGbGFnPTE=',
              'title': 'Camcorders'
            },
            'selected': false,
            'hits': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/ManufacturerName;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZNYW51ZmFjdHVyZXJOYW1lPUEtREFUQSZPbmxpbmVGbGFnPTE=/hits',
              'title': 'Camcorders'
            }
          }
        ],
        'displayType': 'text_clear',
        'selectionType': 'single',
        'limitCount': 7,
        'minCount': 1,
        'scope': 'Global'
      },
      {
        'name': 'Price',
        'type': 'SearchIndexFilter',
        'id': 'ProductSalePriceGross',
        'facets': [
          {
            'name': '<= $ 25',
            'type': 'Facet',
            'count': 226,
            'link': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjAuMCtUTysyNC45OSU1RA==',
              'title': '<= $ 25'
            },
            'selected': false,
            'hits': {
              'type': 'Link',
              'uri': 'inSPIRED-inTRONICS-Site/-/filters/ProductSalePriceGross;SearchParameter=JkBRdWVyeVRlcm09KiZDb250ZXh0Q2F0ZWdvcnlVVUlEPXU5Vl9BQUFCTTFBQUFBRmQ0cTBOTHpjdSZPbmxpbmVGbGFnPTEmUHJvZHVjdFNhbGVQcmljZUdyb3NzPSU1QjAuMCtUTysyNC45OSU1RA==/hits',
              'title': '<= $ 25'
            }
          }
        ],
        'displayType': 'text_clear',
        'selectionType': 'multiple_or',
        'limitCount': -1,
        'minCount': 1,
        'scope': 'Global'
      }
    ],
    'type': 'ResourceCollection',
    'name': 'filters'
  };

  beforeEach(async(() => {
    cacheCustomService = mock(CacheCustomService);
    filterListService = mock(FilterListService);
    when(filterListService.getSideFilters()).thenReturn(Observable.of(filterData));
    TestBed.configureTestingModule({
      declarations: [FilterListComponent],
      imports: [
        CollapseModule
      ],
      providers: [{
        provide: CacheCustomService,
        useFactory: () => instance(cacheCustomService)
      }
      ]
    }).overrideComponent(FilterListComponent, {
      set: {
        providers: [
          {
            provide: FilterListService,
            useFactory: () => instance(filterListService)
          }
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the ngOnInit and get data from Cache', () => {
    when(cacheCustomService.cacheKeyExists(anything())).thenReturn(true);
    when(cacheCustomService.getCachedData(anything(), anything())).thenReturn(filterData);
    fixture.detectChanges();
    expect(component.filterListData).toBe(filterData);
  });

  it('should call the ngOnInit and get data from filterListService', () => {
    when(cacheCustomService.cacheKeyExists(anything())).thenReturn(false);
    when(filterListService.getSideFilters()).thenReturn(Observable.of(filterData));
    fixture.detectChanges();
    expect(component.filterListData).toBe(filterData);
  });
});
