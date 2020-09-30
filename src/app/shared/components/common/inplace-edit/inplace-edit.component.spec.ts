import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { InplaceEditComponent } from './inplace-edit.component';

@Component({
  template: `
    <ish-inplace-edit>
      <p class="form-control-plaintext">VIEW</p>
      <input class="form-control" />
    </ish-inplace-edit>
  `,
})
class DummyComponent {}

describe('Inplace Edit Component', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;
  let element: HTMLElement;
  let document: Document;
  // tslint:disable-next-line: no-suspicious-variable-init-in-tests
  let mousedown: (args: { target: unknown }) => void;
  let inplaceEdit: () => InplaceEditComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DummyComponent, InplaceEditComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    document = TestBed.inject(DOCUMENT);

    document.addEventListener = jest.fn().mockImplementation((_, cb) => {
      mousedown = cb;
    });
    inplaceEdit = () =>
      fixture.debugElement.query(By.css('ish-inplace-edit')).componentInstance as InplaceEditComponent;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always render view component by default', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ish-inplace-edit
        ><div class="d-flex flex-row align-items-baseline" title="inplace_edit.click_to_edit">
          <p class="form-control-plaintext">VIEW</p>
        </div></ish-inplace-edit
      >
    `);
  });

  it('should render edit component when clicked', () => {
    fixture.detectChanges();
    mousedown({ target: element.querySelector('p') });

    expect(element).toMatchInlineSnapshot(`
      <ish-inplace-edit
        ><div class="d-flex flex-row align-items-baseline">
          <input class="form-control" /><button
            class="btn btn-link ml-2"
            data-testing-id="confirm"
            title="inplace_edit.save"
          >
            <fa-icon ng-reflect-icon="fas,check"></fa-icon></button
          ><button class="btn btn-link" data-testing-id="cancel" title="inplace_edit.cancel">
            <fa-icon ng-reflect-icon="fas,times"></fa-icon>
          </button></div
      ></ish-inplace-edit>
    `);
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
      mousedown({ target: element.querySelector('p') });
    });

    it('should be created', () => {
      expect(element.querySelector('input')).toBeTruthy();
    });

    it('should switch to view mode when clicked outside', () => {
      mousedown({ target: element });

      expect(element).toMatchInlineSnapshot(`
        <ish-inplace-edit
          ><div class="d-flex flex-row align-items-baseline" title="inplace_edit.click_to_edit">
            <p class="form-control-plaintext">VIEW</p>
          </div></ish-inplace-edit
        >
      `);
    });

    it('should emit edited event when clicked outside', done => {
      inplaceEdit().edited.subscribe(() => {
        done();
      });

      mousedown({ target: element });
    });

    it('should switch to view mode when clicked on confirm', () => {
      (element.querySelector('[data-testing-id="confirm"') as HTMLButtonElement).click();

      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <ish-inplace-edit
          ><div class="d-flex flex-row align-items-baseline" title="inplace_edit.click_to_edit">
            <p class="form-control-plaintext">VIEW</p>
          </div></ish-inplace-edit
        >
      `);
    });

    it('should emit edited event when clicked on confirm', done => {
      inplaceEdit().edited.subscribe(() => {
        done();
      });

      (element.querySelector('[data-testing-id="confirm"') as HTMLButtonElement).click();
    });

    it('should switch to view mode when clicked on cancel', () => {
      (element.querySelector('[data-testing-id="cancel"') as HTMLButtonElement).click();

      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <ish-inplace-edit
          ><div class="d-flex flex-row align-items-baseline" title="inplace_edit.click_to_edit">
            <p class="form-control-plaintext">VIEW</p>
          </div></ish-inplace-edit
        >
      `);
    });

    it('should emit aborted event when clicked on cancel', done => {
      inplaceEdit().aborted.subscribe(() => {
        done();
      });

      (element.querySelector('[data-testing-id="cancel"') as HTMLButtonElement).click();
    });
  });
});
