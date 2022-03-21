import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';

import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const orderTemplatesFacade = mock(OrderTemplatesFacade);
    when(orderTemplatesFacade.currentOrderTemplate$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccountOrderTemplateDetailPageComponent, MockComponent(ErrorMessageComponent)],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacade) }],
    }).compileComponents();
  });

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
