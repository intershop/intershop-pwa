import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContext, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductBrandComponent } from './product-brand.component';

describe('Product Brand Component', () => {
  let component: ProductBrandComponent;
  let fixture: ComponentFixture<ProductBrandComponent>;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select()).thenReturn(of({ product: { manufacturer: 'Samsung' } as ProductView } as ProductContext));

    await TestBed.configureTestingModule({
      imports: [ProductBrandComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        provideRouter([{ path: '**', component: ProductBrandComponent }]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrandComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to search page when link is clicked', fakeAsync(() => {
    fixture.detectChanges();

    element.querySelector('a').click();

    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/search/Samsung"`);
  }));
});
