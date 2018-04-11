import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from './modal-dialog.component';

describe('Modal Dialog Component', () => {
  let component: ModalDialogComponent;
  let fixture: ComponentFixture<ModalDialogComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [ModalModule.forRoot(), TranslateModule.forRoot()],
        providers: [TranslateService, BsModalService],
        declarations: [ModalDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.title = 'title';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display modal dialog when show function is called', () => {
    fixture.detectChanges();
    component.show();
    expect(component.bsModalDialog).toBeTruthy();
  });

  it('should not display modal dialog when show function is not called', () => {
    fixture.detectChanges();
    expect(component.bsModalDialog).toBeFalsy();
  });
});
