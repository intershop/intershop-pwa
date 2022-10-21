import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProductNotificationsPageComponent } from './account-product-notifications-page.component';

describe('Account Product Notifications Page Component', () => {
  let component: AccountProductNotificationsPageComponent;
  let fixture: ComponentFixture<AccountProductNotificationsPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountProductNotificationsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProductNotificationsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
