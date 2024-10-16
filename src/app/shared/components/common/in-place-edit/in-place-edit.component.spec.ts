import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { InPlaceEditComponent } from './in-place-edit.component';

@Component({
  template: `
    <ish-in-place-edit>
      <p class="form-control-plaintext">VIEW</p>
      <input class="form-control" />
    </ish-in-place-edit>
  `,
})
class DummyComponent {}

describe('In Place Edit Component', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;
  let element: HTMLElement;
  let document: Document;
  let mousedown: (args: { target: unknown }) => void;
  let inplaceEdit: () => InPlaceEditComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DummyComponent, InPlaceEditComponent, MockComponent(FaIconComponent)],
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
      fixture.debugElement.query(By.css('ish-in-place-edit')).componentInstance as InPlaceEditComponent;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always render view component by default', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ish-in-place-edit
        ><div class="d-flex flex-row align-items-baseline">
          <p class="form-control-plaintext">VIEW</p>
          <button class="btn btn-link" title="inplace_edit.click_to_edit">
            <fa-icon class="pl-2 mr-auto btn-link" ng-reflect-icon="fas,pencil-alt"></fa-icon>
          </button></div
      ></ish-in-place-edit>
    `);
  });

  it('should render edit component when clicked', () => {
    fixture.detectChanges();
    mousedown({ target: element.querySelector('p') });

    expect(element).toMatchInlineSnapshot(`
      <ish-in-place-edit
        ><div class="d-flex flex-row align-items-baseline">
          <input class="form-control" /><button
            data-testing-id="confirm"
            class="btn btn-link"
            title="inplace_edit.save"
          >
            <fa-icon ng-reflect-icon="fas,check"></fa-icon></button
          ><button data-testing-id="cancel" class="btn btn-link" title="inplace_edit.cancel">
            <fa-icon ng-reflect-icon="fas,times"></fa-icon>
          </button></div
      ></ish-in-place-edit>
    `);
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
      mousedown({ target: element.querySelector('p') });
    });

    it('should display an input', () => {
      expect(element.querySelector('input')).toBeTruthy();
    });

    it('should switch to view mode when clicked outside', () => {
      mousedown({ target: element });

      expect(element.querySelector('.form-control-plaintext').textContent).toContain('VIEW');
    });

    it('should emit edited event when clicked outside', done => {
      inplaceEdit().edited.subscribe(() => {
        done();
      });

      mousedown({ target: element });
    });

    it('should switch to view mode when clicked on confirm', () => {
      (element.querySelector('[data-testing-id="confirm"]') as HTMLButtonElement).click();

      fixture.detectChanges();

      expect(element.querySelector('input')).toBeFalsy();
    });

    it('should emit edited event when clicked on confirm', done => {
      inplaceEdit().edited.subscribe(() => {
        done();
      });

      (element.querySelector('[data-testing-id="confirm"]') as HTMLButtonElement).click();
    });

    it('should switch to view mode when clicked on cancel', () => {
      (element.querySelector('[data-testing-id="cancel"]') as HTMLButtonElement).click();

      fixture.detectChanges();

      expect(element.querySelector('.form-control-plaintext').textContent).toContain('VIEW');
    });

    it('should emit aborted event when clicked on cancel', done => {
      inplaceEdit().aborted.subscribe(() => {
        done();
      });

      (element.querySelector('[data-testing-id="cancel"]') as HTMLButtonElement).click();
    });
  });
});
