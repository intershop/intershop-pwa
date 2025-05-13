import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentConfigurationParameterMapper } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPageletEntryPointData } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.interface';
import { ServerConfigMapper } from 'ish-core/models/server-config/server-config.mapper';
import { CustomFieldDefinitions, ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { DomService } from 'ish-core/utils/dom/dom.service';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(
    private apiService: ApiService,
    private domService: DomService,
    private contentConfigurationParameterMapper: ContentConfigurationParameterMapper,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private configHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.configuration.v1+json',
  });

  /**
   * Gets the ICM configuration parameters.
   *
   * @returns           The configuration object.
   */
  getServerConfiguration(): Observable<[ServerConfig, CustomFieldDefinitions]> {
    return this.apiService
      .get(`configurations`, {
        headers: this.configHeaders,
        sendLocale: false,
        sendCurrency: false,
      })
      .pipe(map(ServerConfigMapper.fromData));
  }

  /**
   * Gets additional storefront configuration parameters managed via CMS configuration include.
   *
   * @returns           The configuration object.
   */
  getExtraConfiguration(): Observable<ServerConfig> {
    return this.apiService
      .get<ContentPageletEntryPointData>(`cms/includes/include.configuration.pagelet2-Include`, {
        skipApiErrorHandling: true,
        sendPGID: true,
        sendLocale: true,
        sendCurrency: false,
      })
      .pipe(
        map(data =>
          data?.pagelets?.length
            ? (this.contentConfigurationParameterMapper.fromData(
                data?.pagelets[0].configurationParameters
              ) as ServerConfig)
            : undefined
        )
      );
  }

  /**
   * Sets the theme configuration from additional storefront configuration parameters.
   */
  setThemeConfiguration(config: ServerConfig) {
    // Logo
    if (config?.Logo) {
      this.domService.setCssCustomProperty('logo', `url(${config.Logo.toString()})`);
    }

    // Logo Mobile
    if (config?.LogoMobile) {
      this.domService.setCssCustomProperty('logo-mobile', `url(${config.LogoMobile.toString()})`);
    }

    // Favicon
    if (config?.Favicon) {
      this.domService.setAttributeForSelector('link[rel="icon"]', 'href', config.Favicon.toString());
    }

    // CSS Custom Properties
    if (config?.CSSProperties) {
      config.CSSProperties.toString()
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach(property => {
          const propertyKeyValue = property.split(':');
          this.domService.setCssCustomProperty(propertyKeyValue[0].trim(), propertyKeyValue[1].trim());
        });
    }

    // CSS Fonts embedding
    if (config?.CSSFonts) {
      config.CSSFonts.toString()
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach(font => {
          const link = this.domService.createElement<HTMLLinkElement>('link', this.document.head);
          this.domService.setProperty(link, 'rel', 'stylesheet');
          this.domService.setProperty(link, 'href', font.toString());
        });
    }

    // CSS File
    if (config?.CSSFile) {
      const link = this.domService.createElement<HTMLLinkElement>('link', this.document.head);
      this.domService.setProperty(link, 'rel', 'stylesheet');
      this.domService.setProperty(link, 'href', config.CSSFile.toString());
    }

    // CSS Styling
    if (config?.CSSStyling) {
      const style = this.domService.createElement<HTMLStyleElement>('style', this.document.head);
      this.domService.createTextNode(config.CSSStyling.toString(), style);
    }
  }
}
