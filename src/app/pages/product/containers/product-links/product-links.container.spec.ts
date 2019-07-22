import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ProductItemContainerComponent } from '../../../../shared/product/containers/product-item/product-item.container';
import { ProductLinksListComponent } from '../../components/product-links-list/product-links-list.component';

import { ProductLinksContainerComponent } from './product-links.container';

describe('Product Links Container', () => {
  let component: ProductLinksContainerComponent;
  let fixture: ComponentFixture<ProductLinksContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers), TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductItemContainerComponent),
        MockComponent(ProductLinksListComponent),
        ProductLinksContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLinksContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
