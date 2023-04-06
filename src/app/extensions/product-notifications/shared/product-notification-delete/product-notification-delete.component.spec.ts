import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';

import { ProductNotificationDeleteComponent } from './product-notification-delete.component';

describe('Product Notification Delete Component', () => {
  let component: ProductNotificationDeleteComponent;
  let fixture: ComponentFixture<ProductNotificationDeleteComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let productNotificationsFacade: ProductNotificationsFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    productNotificationsFacade = mock(ProductNotificationsFacade);
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockDirective(ServerHtmlDirective),
        ProductNotificationDeleteComponent,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        { provide: ProductNotificationsFacade, useFactory: () => instance(productNotificationsFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationDeleteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should include the delete notification modal dialog', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-modal-dialog')).toBeTruthy();
  });
});
