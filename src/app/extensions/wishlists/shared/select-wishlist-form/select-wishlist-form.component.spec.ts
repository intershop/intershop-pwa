import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { SelectWishlistFormComponent } from './select-wishlist-form.component';

describe('Select Wishlist Form Component', () => {
  let component: SelectWishlistFormComponent;
  let fixture: ComponentFixture<SelectWishlistFormComponent>;
  let element: HTMLElement;
  let wishlistFacade: WishlistsFacade;

  beforeEach(async () => {
    wishlistFacade = mock(wishlistFacade);
    await TestBed.configureTestingModule({
      declarations: [SelectWishlistFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: WishlistsFacade, useFactory: () => instance(wishlistFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    when(wishlistFacade.wishlistSelectOptions$(anything())).thenReturn(
      of([{ value: 'wishlistId', label: 'wishlistName' }])
    );
    fixture = TestBed.createComponent(SelectWishlistFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
