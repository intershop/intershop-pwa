import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteEditComponent } from '../quote-edit/quote-edit.component';
import { QuoteViewComponent } from '../quote-view/quote-view.component';

import { ProductAddToQuoteDialogComponent } from './product-add-to-quote-dialog.component';

describe('Product Add To Quote Dialog Component', () => {
  let component: ProductAddToQuoteDialogComponent;
  let fixture: ComponentFixture<ProductAddToQuoteDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(QuoteEditComponent),
        MockComponent(QuoteViewComponent),
        ProductAddToQuoteDialogComponent,
      ],
      providers: [{ provide: QuotingFacade, useFactory: () => instance(mock(QuotingFacade)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
