import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ModalDialogComponent } from 'ish-shared/common/components/modal-dialog/modal-dialog.component';
import { LineItemEditDialogContainerComponent } from 'ish-shared/line-item/containers/line-item-edit-dialog/line-item-edit-dialog.container';

import { LineItemEditComponent } from './line-item-edit.component';

describe('Line Item Edit Component', () => {
  let component: LineItemEditComponent;
  let fixture: ComponentFixture<LineItemEditComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        LineItemEditComponent,
        MockComponent(LineItemEditDialogContainerComponent),
        MockComponent(ModalDialogComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
