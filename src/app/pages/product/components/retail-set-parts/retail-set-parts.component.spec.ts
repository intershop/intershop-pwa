import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductItemContainerComponent } from '../../../../shared/product/containers/product-item/product-item.container';

import { RetailSetPartsComponent } from './retail-set-parts.component';

describe('Retail Set Parts Component', () => {
  let component: RetailSetPartsComponent;
  let fixture: ComponentFixture<RetailSetPartsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(ProductItemContainerComponent), RetailSetPartsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSetPartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = {
      parts: ['1', '2', '3'],
    } as ProductRetailSet;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display elements for each part', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toHaveLength(3);
  });
});
