import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { CopilotEmbeddedChoice } from '../../../models/copilot-embedded-choice/copilot-embedded-choice.model';

@Component({
  selector: 'ish-copilot-embedded-choices',
  standalone: false,
  templateUrl: './copilot-embedded-choices.component.html',
  styleUrls: ['./copilot-embedded-choices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedChoicesComponent implements AfterViewInit {
  @Input({ required: true }) choices: CopilotEmbeddedChoice;

  @Output() readonly answer = new EventEmitter<string>();

  @ViewChild('choicesGroup') private choicesGroup: ElementRef<HTMLElement>;

  /** Currently ticked options of a multi-select choice prompt. */
  readonly selectedOptions = new Set<string>();

  /** Necessary for a11y: focus ahead of the chips so the next Tab enters them. */
  ngAfterViewInit() {
    this.choicesGroup.nativeElement.focus({ preventScroll: true });
  }

  toggleOption(option: string) {
    if (this.selectedOptions.has(option)) {
      this.selectedOptions.delete(option);
    } else {
      this.selectedOptions.add(option);
    }
  }

  /** Sends the selected options as a single comma-separated answer. */
  submitSelectedOptions() {
    if (this.selectedOptions.size) {
      this.answer.emit([...this.selectedOptions].join(', '));
    }
  }
}
