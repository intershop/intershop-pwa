import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import { anyNumber, anyString, instance, mock, verify } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CsvImportData } from 'ish-core/utils/csv/csv.import-handler';

import { QuickorderCsvFormComponent } from './quickorder-csv-form.component';

describe('Quickorder Csv Form Component', () => {
  let component: QuickorderCsvFormComponent;
  let fixture: ComponentFixture<QuickorderCsvFormComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      imports: [QuickorderCsvFormComponent, ReactiveFormsModule],
      providers: [{ provide: ShoppingFacade, useValue: instance(shoppingFacadeMock) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderCsvFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should parse CSV correctly', () => {
    const csvData: CsvImportData = {
      headers: ['Product ID', 'Quantity'],
      data: ['12345,10', '67890,5'],
    };

    component.parseCsvData(csvData);
    expect(component.productsFromCsv).toHaveLength(2);

    const firstProduct = component.productsFromCsv[0];
    expect(firstProduct.sku).toEqual('12345');
    expect(firstProduct.quantity).toEqual(10);
    const secondProduct = component.productsFromCsv[1];
    expect(secondProduct.sku).toEqual('67890');
    expect(secondProduct.quantity).toEqual(5);
  });

  it('should handle empty csv', () => {
    const csvData: CsvImportData = {
      headers: ['Product ID', 'Quantity'],
      data: [''],
    };

    component.parseCsvData(csvData);
    expect(component.productsFromCsv).toBeTruthy();
    expect(component.productsFromCsv).toHaveLength(0);
  });

  it('should call addProductToBasket on submit', () => {
    fixture.detectChanges();

    const csvData: CsvImportData = {
      headers: ['Product ID', 'Quantity'],
      data: ['12345,10'],
    };

    component.parseCsvData(csvData);
    component.addCsvToCart();

    verify(shoppingFacadeMock.addProductToBasket('12345', 10)).once();
  });

  it('should not call addroductToBasket when parsedProducts is empty on submit', () => {
    fixture.detectChanges();

    const csvData: CsvImportData = {
      headers: ['Product ID', 'Quantity'],
      data: [''],
    };

    component.parseCsvData(csvData);
    component.addCsvToCart();

    verify(shoppingFacadeMock.addProductToBasket(anyString(), anyNumber())).never();
  });

  it('should reset CSV product array and fileInput', () => {
    const csvData: CsvImportData = {
      headers: ['Product ID', 'Quantity'],
      data: ['12345,10', '67890,5'],
    };

    component.parseCsvData(csvData);
    expect(component.productsFromCsv).toHaveLength(2);
    fixture.detectChanges();

    component.resetInput();
    expect(component.productsFromCsv).toHaveLength(0);
    expect(component.fileInput.nativeElement.value).toBeEmpty();
  });
});
