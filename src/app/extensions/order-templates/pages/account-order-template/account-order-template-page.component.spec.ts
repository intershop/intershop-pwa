import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplatePreferencesDialogComponent } from '../../shared/order-template-preferences-dialog/order-template-preferences-dialog.component';

import { AccountOrderTemplateListComponent } from './account-order-template-list/account-order-template-list.component';
import { AccountOrderTemplatePageComponent } from './account-order-template-page.component';

describe('Account Order Template Page Component', () => {
  let component: AccountOrderTemplatePageComponent;
  let fixture: ComponentFixture<AccountOrderTemplatePageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const orderTemplatesFacade = mock(OrderTemplatesFacade);

    TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [
        AccountOrderTemplatePageComponent,
        MockComponent(AccountOrderTemplateListComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(OrderTemplatePreferencesDialogComponent),
      ],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplatePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
