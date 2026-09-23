import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductAdvisorChatMessage } from '../../../models/product-advisor/product-advisor.model';
import { ProductAdvisorHeaderComponent } from '../product-advisor-header/product-advisor-header.component';

import { ProductAdvisorChatComponent } from './product-advisor-chat.component';

describe('Product Advisor Chat Component', () => {
  let component: ProductAdvisorChatComponent;
  let fixture: ComponentFixture<ProductAdvisorChatComponent>;
  let element: HTMLElement;

  function botMessage(choices?: ProductAdvisorChatMessage['choices']): ProductAdvisorChatMessage {
    return { message: 'How do these employees mainly work?', type: 'apiMessage', choices };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [MockComponent(ProductAdvisorHeaderComponent), ProductAdvisorChatComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdvisorChatComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.deviceType = 'desktop';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('choice chips', () => {
    it('should render single-select chips without a confirm button for the last bot message', () => {
      component.messages = [botMessage({ options: ['In the office', 'Hybrid', 'Mobile'], multiSelect: false })];
      fixture.detectChanges();

      const chips = element.querySelectorAll('.advisor-choices .advisor-choice-chip');
      expect(chips).toHaveLength(3);
      expect(element.querySelector('.advisor-choice-confirm')).toBeFalsy();
    });

    it('should emit the option label when a single-select chip is clicked', () => {
      const emit = jest.spyOn(component.send, 'emit');
      component.messages = [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })];
      fixture.detectChanges();

      element.querySelector<HTMLButtonElement>('.advisor-choice-chip').click();

      expect(emit).toHaveBeenCalledWith('Hybrid');
    });

    it('should render a confirm button for multi-select and emit the joined selection', () => {
      const emit = jest.spyOn(component.send, 'emit');
      component.messages = [botMessage({ options: ['Docking station', 'Headset', 'Monitor'], multiSelect: true })];
      fixture.detectChanges();

      const chips = element.querySelectorAll<HTMLButtonElement>('.advisor-choice-chip');
      chips[0].click();
      chips[1].click();
      fixture.detectChanges();

      const confirm = element.querySelector<HTMLButtonElement>('.advisor-choice-confirm');
      expect(confirm.disabled).toBeFalse();
      confirm.click();

      expect(emit).toHaveBeenCalledWith('Docking station, Headset');
    });

    it('should keep the confirm button disabled while nothing is selected', () => {
      component.messages = [botMessage({ options: ['Headset', 'Monitor'], multiSelect: true })];
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.advisor-choice-confirm').disabled).toBeTrue();
    });

    it('should not render chips for a message that is not the last one', () => {
      component.messages = [
        botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false }),
        { message: 'A later reply', type: 'apiMessage' },
      ];
      fixture.detectChanges();

      expect(element.querySelector('.advisor-choices')).toBeFalsy();
    });

    it('should not render chips while loading', () => {
      component.messages = [botMessage({ options: ['Hybrid', 'In the office'], multiSelect: false })];
      component.loading = true;
      fixture.detectChanges();

      expect(element.querySelector('.advisor-choices')).toBeFalsy();
    });

    it('should reset the selection when the messages change', () => {
      component.messages = [botMessage({ options: ['Headset', 'Monitor'], multiSelect: true })];
      component.toggleOption('Monitor');
      expect(component.selectedOptions.has('Monitor')).toBeTrue();

      const next = [botMessage()];
      component.messages = next;
      component.ngOnChanges({ messages: new SimpleChange(undefined, next, false) });

      expect(component.selectedOptions.size).toBe(0);
    });
  });
});
