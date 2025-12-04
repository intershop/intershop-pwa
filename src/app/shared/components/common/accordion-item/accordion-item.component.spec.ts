import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCollapse, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MockDirective } from 'ng-mocks';

import { AccordionItemComponent } from './accordion-item.component';

describe('Accordion Item Component', () => {
  let component: AccordionItemComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<AccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionItemComponent],
    })
      .overrideComponent(AccordionItemComponent, {
        remove: { imports: [NgbCollapseModule] },
        add: { imports: [MockDirective(NgbCollapse)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show panel body when click on panel header', () => {
    const headingLinks = element.querySelectorAll('.panel-heading');

    (headingLinks[0] as HTMLElement).click();

    fixture.detectChanges();

    expect(element.querySelector('i[class="fs-2 bi bi-dash"]')).toBeTruthy();
    expect(component.isCollapsed).toBeFalse();
  });

  it('should hide panel body when click on panel header again', () => {
    const headingLinks = element.querySelectorAll('.panel-heading');

    (headingLinks[0] as HTMLElement).click();
    (headingLinks[0] as HTMLElement).click();

    fixture.detectChanges();

    expect(element.querySelector('i[class="fs-2 bi bi-plus"]')).toBeTruthy();
    expect(component.isCollapsed).toBeTrue();
  });
});
