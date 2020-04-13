import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatePreferencesDialogComponent } from '../../shared/order-templates/order-template-preferences-dialog/order-template-preferences-dialog.component';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
      declarations: [
        AccountOrderTemplateDetailPageComponent,
        MockComponent(AccountOrderTemplateDetailLineItemComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(OrderTemplatePreferencesDialogComponent),
        MockComponent(ProductAddToBasketComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
