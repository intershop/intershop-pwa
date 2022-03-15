import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock, verify } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductSendToCompareComponent } from './product-send-to-compare.component';

describe('Product Send To Compare Component', () => {
  let component: ProductSendToCompareComponent;
  let fixture: ComponentFixture<ProductSendToCompareComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), ProductSendToCompareComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSendToCompareComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit "product to compare" event when compare link is clicked', () => {
    fixture.detectChanges();

    element.querySelector('a').click();

    verify(context.addToCompare()).once();
  });
});
