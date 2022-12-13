import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProductNotificationsListComponent } from './account-product-notifications-list.component';

describe('Account Product Notifications List Component', () => {
  let component: AccountProductNotificationsListComponent;
  let fixture: ComponentFixture<AccountProductNotificationsListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountProductNotificationsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProductNotificationsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
