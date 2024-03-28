import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { InPlaceEditComponent } from 'ish-shared/components/common/in-place-edit/in-place-edit.component';

import { LineItemExtendedContentEntryComponent } from './line-item-extended-content-entry.component';

describe('Line Item Extended Content Entry Component', () => {
  let component: LineItemExtendedContentEntryComponent;
  let fixture: ComponentFixture<LineItemExtendedContentEntryComponent>;
  let element: HTMLElement;
  let settingEnabled: boolean;

  beforeEach(async () => {
    settingEnabled = true;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        LineItemExtendedContentEntryComponent,
        MockComponent(InPlaceEditComponent),
        MockPipe(ServerSettingPipe, () => settingEnabled),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentEntryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with disabled setting', () => {
    beforeEach(() => {
      settingEnabled = false;
    });

    it('should not display', () => {
      component.ngOnChanges();
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`N/A`);
    });
  });

  describe('with line item', () => {
    beforeEach(() => {
      component.lineItem = {
        partialOrderNo: '123456',
      };
      component.key = 'partialOrderNo';
    });

    it('should display partial order number', () => {
      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.textContent).toMatchInlineSnapshot(`"line-item.partialOrderNo.label 123456 "`);
    });

    describe('if editable', () => {
      beforeEach(() => {
        component.editable = true;
      });

      it('should display in-place edit component', () => {
        component.ngOnChanges();
        fixture.detectChanges();

        expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
          [
            "ish-in-place-edit",
          ]
        `);
      });
    });
  });
});
