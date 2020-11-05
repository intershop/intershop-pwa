import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TactonProductConfigurationBomItem } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonBomComponent } from './tacton-bom.component';

describe('Tacton Bom Component', () => {
  let component: TactonBomComponent;
  let fixture: ComponentFixture<TactonBomComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TactonBomComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonBomComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display bom items if bom is supplied', () => {
    component.bom = [{ description: 'product descr', name: 'xyz', qty: '1' } as TactonProductConfigurationBomItem];

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <h3>tacton.bom.title</h3>
      <table class="table table-sm">
        <tr>
          <td>
            product descr<br />
            tacton.bom.name.label xyz<br />
            tacton.bom.quantity.label 1
          </td>
        </tr>
      </table>
    `);
  });
});
