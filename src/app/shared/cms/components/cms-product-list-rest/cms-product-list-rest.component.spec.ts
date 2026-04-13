/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { CMSProductListRestComponent } from './cms-product-list-rest.component';

const restEndpoint = 'https://icm/products?attrs=sku';

const simpleRestEndpoint = 'https://icm/simpleProductSkuArray';

const pageletData = {
  definitionQualifiedName: 'fq',
  id: 'id',
  displayName: 'name',
  domain: 'domain',
  configurationParameters: {
    ProductsRestEndpoint: restEndpoint,
    ProductsRestResponseMapper: 'data.elements.map(item => item.attributes[0].value)',
  },
};

const restJson = {
  elements: [
    { attributes: [{ name: 'sku', type: 'String', value: '111' }] },
    { attributes: [{ name: 'sku', type: 'String', value: '222' }] },
    { attributes: [{ name: 'sku', type: 'String', value: '333' }] },
    { attributes: [{ name: 'sku', type: 'String', value: '444' }] },
  ],
  type: 'ResourceCollection',
  name: 'products',
};

const skuArray = ['aaa', 'bbb', 'ccc'];

describe('Cms Product List Rest Component', () => {
  let component: CMSProductListRestComponent;
  let fixture: ComponentFixture<CMSProductListRestComponent>;
  let element: HTMLElement;
  let httpClient: HttpClient;
  const apiService = mock(ApiService);
  const sparqueApiService = mock(SparqueApiService);

  beforeEach(async () => {
    httpClient = mock(HttpClient);

    await TestBed.configureTestingModule({
      imports: [CMSProductListRestComponent],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
      ],
    })
      .overrideComponent(CMSProductListRestComponent, {
        remove: { imports: [ProductsListComponent] },
        add: { imports: [MockComponent(ProductsListComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListRestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pagelet = createContentPageletView(pageletData);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('getProductSKUs$', () => {
    beforeEach(() => {
      when(httpClient.get(restEndpoint)).thenReturn(of(restJson));
      when(httpClient.get(simpleRestEndpoint)).thenReturn(of(skuArray));
    });

    it('should map REST JSON data to a product SKUs array', done => {
      component.ngOnChanges();
      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toMatchInlineSnapshot(`
          [
            "111",
            "222",
            "333",
            "444",
          ]
        `);
        done();
      });
    });

    it('should map REST JSON data to a product SKUs array and limit it to only 2 elements', done => {
      component.pagelet = createContentPageletView({
        ...pageletData,
        configurationParameters: {
          ...pageletData.configurationParameters,
          MaxNumberOfProducts: 2,
        },
      });
      component.ngOnChanges();
      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toMatchInlineSnapshot(`
          [
            "111",
            "222",
          ]
        `);
        done();
      });
    });

    it('should just return simple SKUs array', done => {
      component.pagelet = createContentPageletView({
        ...pageletData,
        configurationParameters: {
          ProductsRestEndpoint: 'https://icm/simpleProductSkuArray',
        },
      });
      component.ngOnChanges();
      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toMatchInlineSnapshot(`
          [
            "aaa",
            "bbb",
            "ccc",
          ]
        `);
        done();
      });
    });
  });
});
