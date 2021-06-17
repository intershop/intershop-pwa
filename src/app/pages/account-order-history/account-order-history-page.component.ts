import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

/**
 * The Order History Page Container Component renders the account history page of a logged in user using the {@link OrderHistoryPageComponent}
 *
 */
@Component({
  templateUrl: './account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderHistoryPageComponent {
  constructor(private featureToggle: FeatureToggleService) {}

  isFeatureEnabled(feature: string): boolean {
    return this.featureToggle.enabled(feature);
  }
}
