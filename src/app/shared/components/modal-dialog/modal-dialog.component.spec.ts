import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from './modal-dialog.component';

describe('Modal Dialog Component', () => {
  let component: ModalDialogComponent;
  let fixture: ComponentFixture<ModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        TranslateService,
        BsModalService
      ],
      declarations: [ModalDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialogComponent);
    component = fixture.componentInstance;
    component.title = 'title';
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
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
