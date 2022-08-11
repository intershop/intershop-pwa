import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ish-maintenance-page',
  templateUrl: './maintenance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenancePageComponent implements OnInit {
  headline = 'MAINTENANCE';

  text =
    '<p>Sehr geehrter Kunde,</p><p>Vielen Dank für Ihren Besuch auf unserer Seite.</p><p>Wir führen derzeit planmäßige Wartungsarbeiten durch, um unseren Online-Shop auf den neuesten Stand zu bringen.</br>Während dieser Wartungsarbeiten ist ein Einkauf leider nicht möglich. Bitte besuchen Sie uns bald wieder!</p><p>Vielen Dank für Ihr Verständnis.</p><p>Ihr Intershop Team</p>';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translate();
  }

  private translate() {
    if (this.translateService.currentLang === 'en_US') {
      this.headline = 'WARTUNGSARBEITEN';
      this.text =
        '<p>Dear customer,</p><p>Thank you for visiting our site.</p><p>We are currently performing scheduled maintenance to bring our online store up to date.<br />Unfortunately, shopping is not possible during this maintenance. Please visit us again soon!</p><p>Thank you for your understanding.</p><p>Your Intershop Team</p>';
    } else if (this.translateService.currentLang === 'fr_FR') {
      this.headline = 'TRAVAUX DE MAINTENANCE';
      this.text =
        "<p>Chers clients,</p><p>Merci de votre visite sur notre site.</p><p>Nous effectuons actuellement des travaux de maintenance programmés afin de mettre à jour notre boutique en ligne.</br>Pendant ces travaux de maintenance, il n'est malheureusement pas possible de faire des achats. Nous vous invitons à revenir bientôt!</p><p>Merci de votre compréhension.</p><p>L'équipe; Intershop</p>";
    }
  }
}
