import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { quotingReducers } from '../../../../store/quoting-store.module';
import { ProductAddToQuoteDialogComponent } from '../../components/product-add-to-quote-dialog/product-add-to-quote-dialog.component';

import { ProductAddToQuoteDialogContainerComponent } from './product-add-to-quote-dialog.container';

describe('Product Add To Quote Dialog Container', () => {
  let component: ProductAddToQuoteDialogContainerComponent;
  let fixture: ComponentFixture<ProductAddToQuoteDialogContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
        }),
      ],
      declarations: [MockComponent(ProductAddToQuoteDialogComponent), ProductAddToQuoteDialogContainerComponent],
      providers: [NgbActiveModal],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductAddToQuoteDialogContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
