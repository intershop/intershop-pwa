import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * The safeHtml Pipe bypasses Angulars DomSanitizer to prevent the stripping of wanted
 * inline styles etc. that is supposed to come from safe sources, e.g. the Intershop CMS.
 *
 * source: https://stackoverflow.com/questions/39628007/angular2-innerhtml-binding-remove-style-attribute
 *
 * @example
 * <div [innerHtml]="html | safeHtml"></div>
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
