import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { WishlistLineItemComponent } from './wishlist-line-item.component';

describe('Wishlist Line Item Component', () => {
  let component: WishlistLineItemComponent;
  let fixture: ComponentFixture<WishlistLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(mock(WishlistsFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
