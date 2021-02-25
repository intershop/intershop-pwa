import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ModalDialogComponent } from './modal-dialog.component';

describe('Modal Dialog Component', () => {
  let component: ModalDialogComponent<string>;
  let fixture: ComponentFixture<ModalDialogComponent<string>>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModalModule, TranslateModule.forRoot()],
      declarations: [ModalDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<typeof component>(ModalDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.options = {
      titleText: 'test',
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display modal dialog when show function is called', () => {
    fixture.detectChanges();
    component.show();
    expect(component.ngbModalRef).toBeTruthy();
  });

  it('should not display modal dialog when show function is not called', () => {
    fixture.detectChanges();
    expect(component.ngbModalRef).toBeFalsy();
  });

  it('should output input data on confirm', done => {
    component.show('test');
    component.confirmed.subscribe((data: string) => {
      expect(data).toBe('test');
      done();
    });
    component.confirm();
  });
});
