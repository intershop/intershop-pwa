import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { InPlaceEditComponent } from 'ish-shared/components/common/in-place-edit/in-place-edit.component';

import { LineItemExtendedContentEntryComponent } from './line-item-extended-content-entry.component';

describe('Line Item Extended Content Entry Component', () => {
  let component: LineItemExtendedContentEntryComponent;
  let fixture: ComponentFixture<LineItemExtendedContentEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [LineItemExtendedContentEntryComponent, MockComponent(InPlaceEditComponent)],
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
