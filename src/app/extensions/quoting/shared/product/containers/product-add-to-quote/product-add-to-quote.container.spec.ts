import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { QuotingFacade } from '../../../../facades/quoting.facade';

import { ProductAddToQuoteContainerComponent } from './product-add-to-quote.container';

describe('Product Add To Quote Container', () => {
  let component: ProductAddToQuoteContainerComponent;
  let fixture: ComponentFixture<ProductAddToQuoteContainerComponent>;
  let element: HTMLElement;
  let quotingFacade: QuotingFacade;

  beforeEach(async(() => {
    quotingFacade = mock(QuotingFacade);
    const accountFacade = mock(AccountFacade);
    when(accountFacade.isLoggedIn$).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), ProductAddToQuoteContainerComponent],
      providers: [
        { provide: QuotingFacade, useFactory: () => instance(quotingFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductAddToQuoteContainerComponent);
        component = fixture.componentInstance;
        component.product = { sku: 'dummy', minOrderQuantity: 5 } as Product;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show button when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should show icon button when display type is icon ', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should use facade when addToQuote is triggered.', () => {
    component.addToQuote();

    verify(quotingFacade.addProductToQuoteRequest('dummy', 5)).once();
  });
});
