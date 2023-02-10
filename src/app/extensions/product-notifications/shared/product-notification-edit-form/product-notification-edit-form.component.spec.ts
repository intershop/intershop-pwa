import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { ProductNotificationEditFormComponent } from './product-notification-edit-form.component';

describe('Product Notification Edit Form Component', () => {
  let component: ProductNotificationEditFormComponent;
  let fixture: ComponentFixture<ProductNotificationEditFormComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let appFacade: AppFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    appFacade = mock(AppFacade);
    accountFacade = mock(accountFacade);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
      imports: [FormlyTestingModule],
      declarations: [ProductNotificationEditFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationEditFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
