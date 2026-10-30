import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { InPlaceEditComponent } from './in-place-edit.component';

@Component({
  standalone: false,
  template: `
    <ish-in-place-edit>
      <p viewModeContent>VIEW</p>
      <input editModeForm />
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
      imports: [TranslatePipe],
      declarations: [DummyComponent, InPlaceEditComponent],
      providers: [provideTranslateService()],
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

  it('should always render view mode by default', () => {
    fixture.detectChanges();

    expect(element.querySelector('[viewModeContent]')?.textContent).toContain('VIEW');
    expect(element.querySelector('input')).toBeFalsy();

    const button = element.querySelector<HTMLButtonElement>('button');
    expect(button?.title).toEqual('inplace_edit.click_to_edit');
    expect(button?.getAttribute('aria-label')).toEqual('inplace_edit.click_to_edit');
    expect(button?.querySelector('i')?.classList).toContain('bi-pencil-fill');
  });

  it('should render edit mode when clicked', () => {
    fixture.detectChanges();
    mousedown({ target: element.querySelector('p') });
    fixture.detectChanges();

    expect(element.querySelector('input')).toBeTruthy();

    const confirm = element.querySelector<HTMLButtonElement>('[data-testing-id="confirm"]');
    expect(confirm?.title).toEqual('inplace_edit.save');
    expect(confirm?.querySelector('i')?.classList).toContain('bi-check-lg');

    const cancel = element.querySelector<HTMLButtonElement>('[data-testing-id="cancel"]');
    expect(cancel?.title).toEqual('inplace_edit.cancel');
    expect(cancel?.querySelector('i')?.classList).toContain('bi-x');
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

      expect(element.querySelector('[viewModeContent]').textContent).toContain('VIEW');
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

      expect(element.querySelector('[viewModeContent]').textContent).toContain('VIEW');
    });

    it('should emit aborted event when clicked on cancel', done => {
      inplaceEdit().aborted.subscribe(() => {
        done();
      });

      (element.querySelector('[data-testing-id="cancel"]') as HTMLButtonElement).click();
    });
  });
});
