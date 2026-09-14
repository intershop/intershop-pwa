import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-product-advisor-chat',
  standalone: false,
  templateUrl: './product-advisor-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorChatComponent {}
