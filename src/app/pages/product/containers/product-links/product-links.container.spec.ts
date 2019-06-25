import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { coreReducers } from 'ish-core/store/core-store.module';

import { ProductLinksContainerComponent } from './product-links.container';

describe('Product Links Container', () => {
  let component: ProductLinksContainerComponent;
  let fixture: ComponentFixture<ProductLinksContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      declarations: [ProductLinksContainerComponent],
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
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
