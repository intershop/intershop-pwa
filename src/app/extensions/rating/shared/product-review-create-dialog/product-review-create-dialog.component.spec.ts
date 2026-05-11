import { AsyncPipe } from '@angular/common';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FormSubmitDirective } from 'ish-core/directives/form-submit.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';

import { ProductReviewCreateDialogComponent } from './product-review-create-dialog.component';

@Directive({
  selector: '[ishProductContextAccess]',
  standalone: true,
})
class MockProductContextAccessDirective {
  constructor(templateRef: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    viewContainerRef.createEmbeddedView(templateRef, { product: { sku: 'sku' }, context: {} });
  }

  static ngTemplateContextGuard(
    _: MockProductContextAccessDirective,
    ctx: unknown
  ): ctx is { product: { sku: string } } {
    return !!ctx || true;
  }
}

/* eslint-disable @angular-eslint/directive-selector */
@Directive({
  selector: 'form',
  exportAs: 'ngForm',
  standalone: true,
})
class MockNgFormDirective {
  // eslint-disable-next-line ish-custom-rules/newline-before-root-members
  submitted = false;
}

/* eslint-enable @angular-eslint/directive-selector */

describe('Product Review Create Dialog Component', () => {
  let component: ProductReviewCreateDialogComponent;
  let fixture: ComponentFixture<ProductReviewCreateDialogComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let reviewsFacade: ProductReviewsFacade;
  let modalService: Pick<NgbModal, 'open'>;

  /**
   * emulates a realistic startup scenario:
   * the component is initialized before the show() function is called and
   * real functionality begins
   */
  function startup() {
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    reviewsFacade = mock(ProductReviewsFacade);
    modalService = {
      open: jest.fn(() => ({ close: jest.fn() }) as never),
    };
    when(accountFacade.user$).thenReturn(of({ firstName: 'Patricia', lastName: 'Miller' } as User));

    await TestBed.configureTestingModule({
      imports: [ProductReviewCreateDialogComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: NgbModal, useValue: modalService },
        { provide: ProductReviewsFacade, useFactory: () => instance(reviewsFacade) },
      ],
    })
      .overrideComponent(ProductReviewCreateDialogComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockComponent(FormlyForm),
            MockDirective(FormSubmitDirective),
            MockNgFormDirective,
            MockProductContextAccessDirective,
            MockComponent(ProductIdComponent),
            MockComponent(ProductImageComponent),
            MockComponent(ProductNameComponent),
            MockComponent(ProductVariationDisplayComponent),
            MockPipe(TranslatePipe),
            ReactiveFormsModule,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReviewCreateDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    startup();

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
