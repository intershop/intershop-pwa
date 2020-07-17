import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonReadonlyComponent } from './tacton-readonly.component';

describe('Tacton Readonly Component', () => {
  let component: TactonReadonlyComponent;
  let fixture: ComponentFixture<TactonReadonlyComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TactonReadonlyComponent],
    }).compileComponents();
  }));

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

    expect(element).toMatchInlineSnapshot(`
      <h4>description</h4>
      <div class="row">
        <div class="col-4">info</div>
        <div class="col-8">1</div>
      </div>
    `);
  });

  it('should not render if hidden', () => {
    component.parameter.properties.hidden = 'yes';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });
});
