import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

/**
 * Type to render a group of fields within ``<fieldset>`` tags.
 *
 * @props **fieldsetClass** - used to add styles to the ``<fieldset>`` tag.
 * @props **childClass** - used to add styles to a child ``<div>``.
 * @props **legend** - used to add a legend to the ``<fieldset>`` tag, the value is displayed as the legend text and will also be translated.
 * @props **legendClass** - used to add styles to the ``<legend>`` tag.
 *
 * @usageNotes
 * Control the rendered children via the ``fieldGroup`` attribute.
 * Don't provide a key unless you want a nested form.
 * You can specify a bootstrap ``row`` and ``col`` setup using the parent-child relationship
 * of ``fieldsetClass`` and ``childClass``.
 */
@Component({
  selector: 'ish-fieldset-field',
  templateUrl: './fieldset-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetFieldComponent extends FieldType {}
