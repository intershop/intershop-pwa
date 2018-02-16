import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from './modal-dialog.component';

describe('Modal Dialog Component', () => {
  let component: ModalDialogComponent;
  let fixture: ComponentFixture<ModalDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        TranslateService
      ],
      declarations: [ModalDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.title = 'title';
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display modal popup when show function is called', () => {
    fixture.detectChanges();
    component.show();
    expect(component.modalDialog.isShown).toBe(true);
  });

  it('should not display modal popup when show function is not called', () => {
    fixture.detectChanges();
    expect(component.modalDialog.isShown).toBe(false);
  });

  it('should close modal popup when close button clicked', () => {
    fixture.detectChanges();
    component.show();
    (<HTMLElement>element.querySelector('.close')).click();
    component.modalDialog.hide();
    expect(component.modalDialog.isShown).toBe(false);
  });
});
