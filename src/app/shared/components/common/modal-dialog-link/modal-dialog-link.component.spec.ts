import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ModalDialogLinkComponent } from './modal-dialog-link.component';

describe('Modal Dialog Link Component', () => {
  let component: ModalDialogLinkComponent;
  let fixture: ComponentFixture<ModalDialogLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ModalDialogComponent), ModalDialogLinkComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a link and a dialog after creation', () => {
    component.linkText = 'testLink';
    component.options = { titleText: 'Dialog Title' };

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`<a rel="nofollow">testLink</a><ish-modal-dialog></ish-modal-dialog>`);
  });
});
