import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';

import { ProductReviewCreateDialogComponent } from './product-review-create-dialog.component';

describe('Product Review Create Dialog Component', () => {
  let component: ProductReviewCreateDialogComponent;
  let fixture: ComponentFixture<ProductReviewCreateDialogComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let reviewsFacade: ProductReviewsFacade;

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
    when(accountFacade.user$).thenReturn(of({ firstName: 'Patricia', lastName: 'Miller' } as User));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductReviewCreateDialogComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: ProductReviewsFacade, useFactory: () => instance(reviewsFacade) },
      ],
    }).compileComponents();
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
