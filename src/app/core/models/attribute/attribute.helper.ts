import { Attribute } from './attribute.model';

export class AttributeHelper {
  /**
   * Gets a specific attribute by attribute name.
   *
   * @param attributes      An array of attributes belonging to an object (e.g. product, basket etc.).
   * @param attributeName   The attribute name of the attribute to get.
   * @returns               The matching attribute.
   */
  static getAttributeByAttributeName(attributes: Attribute[], attributeName: string): Attribute {
    if (!attributes) {
      return;
    }
    return attributes.find(attribute => attribute.name === attributeName);
  }

  /**
   * Gets an attribute value of an attribute within an attribute array.
   * Checks if the attribute is available and returns the value, otherwise undefined.
   *
   * @param attributes      An array of attributes belonging to an object (e.g. product, basket etc.).
   * @param attributeName   The attribute name of the appropriate attribute.
   * @returns               The matching attribute value.
   */
  static getAttributeValueByAttributeName<T>(attributes: Attribute[], attributeName: string) {
    const attribute = AttributeHelper.getAttributeByAttributeName(attributes, attributeName);
    return attribute ? (attribute.value as T) : undefined;
  }
}
