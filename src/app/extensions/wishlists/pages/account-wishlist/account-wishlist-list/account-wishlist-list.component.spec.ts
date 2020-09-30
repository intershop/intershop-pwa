import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { AccountWishlistListComponent } from './account-wishlist-list.component';

describe('Account Wishlist List Component', () => {
  let component: AccountWishlistListComponent;
  let fixture: ComponentFixture<AccountWishlistListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountWishlistListComponent, MockComponent(FaIconComponent), MockComponent(ModalDialogComponent)],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWishlistListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit delete id when delete is called', () => {
    const emitter = spy(component.deleteWishlist);

    component.delete('deleteId');

    verify(emitter.emit('deleteId')).once();
  });
});
