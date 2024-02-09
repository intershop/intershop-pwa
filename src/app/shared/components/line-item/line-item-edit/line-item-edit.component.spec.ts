import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { LineItemEditComponent } from './line-item-edit.component';

describe('Line Item Edit Component', () => {
  let component: LineItemEditComponent;
  let fixture: ComponentFixture<LineItemEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.serverSetting$(anyString())).thenReturn(EMPTY);
    when(appFacade.customFieldsForScope$(anyString())).thenReturn(EMPTY);

    const context = mock(ProductContextFacade);
    when(context.select(anyString())).thenReturn(EMPTY);
    when(context.select(anyString(), anyString())).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LineItemEditComponent, MockComponent(ModalDialogComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    })
      .overrideComponent(LineItemEditComponent, {
        set: {
          providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
        },
      })
      .compileComponents();
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
