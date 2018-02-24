import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';
import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageContainerComponent],
      // TODO: more sophisticated testing
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
