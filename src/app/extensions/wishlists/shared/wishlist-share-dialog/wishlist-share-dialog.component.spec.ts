import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistShareDialogComponent } from './wishlist-share-dialog.component';

describe('Wishlist Share Dialog Component', () => {
  let component: WishlistShareDialogComponent;
  let fixture: ComponentFixture<WishlistShareDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistShareDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistShareDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
