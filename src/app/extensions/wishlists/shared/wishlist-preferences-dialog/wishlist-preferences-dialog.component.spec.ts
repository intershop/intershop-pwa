import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, spy, verify } from 'ts-mockito';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { WishlistPreferencesDialogComponent } from './wishlist-preferences-dialog.component';

describe('Wishlist Preferences Dialog Component', () => {
  let component: WishlistPreferencesDialogComponent;
  let fixture: ComponentFixture<WishlistPreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistPreferencesDialogComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistPreferencesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit new wishlist data when submit form was called and the form was valid', () => {
    fixture.detectChanges();
    component.model = {
      title: 'test wishlist',
      preferred: true,
    };

    const emitter = spy(component.submit);

    component.submitWishlistForm();

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "id": "test wishlist",
        "preferred": true,
        "public": false,
        "title": "test wishlist",
      }
    `);
  });

  it('should not emit new wishlist data when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    component.wishListForm.addControl('title', new FormControl(undefined, Validators.required));

    const emitter = spy(component.submit);
    component.submitWishlistForm();

    verify(emitter.emit(anything())).never();
  });
});
