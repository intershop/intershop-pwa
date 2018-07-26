import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MockComponent } from '../../../utils/dev/mock.component';
import { quotingReducers } from '../../store/quoting.system';
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
      declarations: [
        MockComponent({
          selector: 'ish-product-add-to-quote-dialog',
          template: 'Product Add To Quote Dialog',
          inputs: ['bsModalRef', 'quote', 'quoteLoading'],
        }),
        ProductAddToQuoteDialogContainerComponent,
      ],
      providers: [BsModalRef],
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
