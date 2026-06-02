import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ProductListPagingComponent } from 'ish-shared/components/product/product-list-paging/product-list-paging.component';

import { ProductListToolbarComponent } from './product-list-toolbar.component';

describe('Product List Toolbar Component', () => {
  let component: ProductListToolbarComponent;
  let fixture: ComponentFixture<ProductListToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListToolbarComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(ProductListToolbarComponent, {
        remove: { imports: [ProductListPagingComponent, TranslatePipe] },
        add: { imports: [MockComponent(ProductListPagingComponent), MockPipe(TranslatePipe)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
