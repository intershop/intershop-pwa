import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListFilterComponent } from './product-list-filter.component';

describe('ProductListFilterComponent', () => {
  let component: ProductListFilterComponent;
  let fixture: ComponentFixture<ProductListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
