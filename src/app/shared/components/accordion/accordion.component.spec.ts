import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';

describe('Accordion Container Component', () => {

  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
