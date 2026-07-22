import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplatePreferencesDialogComponent } from '../../shared/order-template-preferences-dialog/order-template-preferences-dialog.component';

import { AccountOrderTemplateListComponent } from './account-order-template-list/account-order-template-list.component';
import { AccountOrderTemplatePageComponent } from './account-order-template-page.component';

describe('Account Order Template Page Component', () => {
  let component: AccountOrderTemplatePageComponent;
  let fixture: ComponentFixture<AccountOrderTemplatePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.orderTemplatesWithDetails$()).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [
        AccountOrderTemplatePageComponent,
        MockComponent(AccountOrderTemplateListComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(OrderTemplatePreferencesDialogComponent),
      ],
      providers: [
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

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
