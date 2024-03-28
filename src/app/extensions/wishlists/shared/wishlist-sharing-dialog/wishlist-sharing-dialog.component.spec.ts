import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistSharingDialogComponent } from './wishlist-sharing-dialog.component';

describe('Wishlist Sharing Dialog Component', () => {
  let component: WishlistSharingDialogComponent;
  let fixture: ComponentFixture<WishlistSharingDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSharingDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
