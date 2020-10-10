import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { LineItemEditDialogComponent } from 'ish-shared/components/line-item/line-item-edit-dialog/line-item-edit-dialog.component';

import { LineItemEditComponent } from './line-item-edit.component';

describe('Line Item Edit Component', () => {
  let component: LineItemEditComponent;
  let fixture: ComponentFixture<LineItemEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        LineItemEditComponent,
        MockComponent(LineItemEditDialogComponent),
        MockComponent(ModalDialogComponent),
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }],
    }).compileComponents();
  });

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
