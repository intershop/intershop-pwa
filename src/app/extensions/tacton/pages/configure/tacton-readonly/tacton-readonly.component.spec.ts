import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonReadonlyComponent } from './tacton-readonly.component';

describe('Tacton Readonly Component', () => {
  let component: TactonReadonlyComponent;
  let fixture: ComponentFixture<TactonReadonlyComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TactonReadonlyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonReadonlyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parameter = ({
      isGroup: false,
      isParameter: true,
      name: 'ID',
      description: 'description',
      value: '1',
      valueDescription: '1',
      committed: false,
      alwaysCommitted: false,
      properties: {
        hidden: 'no',
        guitype: 'readonly',
        hasDetailedView: false,
        tc_info_text: 'info',
      },
    } as unknown) as TactonProductConfigurationParameter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render text if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`<p>1</p>`);
  });

  it('should render link if pattern matches', () => {
    component.parameter.value = 'https://example.org';
    component.parameter.valueDescription = 'LINK';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`<a target="_blank" href="https://example.org">LINK</a>`);
  });
});
