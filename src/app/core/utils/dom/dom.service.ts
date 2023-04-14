import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';

/**
 * Utility Service for DOM Manipulations using Angular Renderer2. It allows you to manipulate DOM elements without accessing the DOM directly. While working with SSR DOM manipulations are not possible on server, this is also handled properly.
 *
 **/

@Injectable({ providedIn: 'root' })
export class DomService {
  private renderer: Renderer2;
  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    // Get an instance of Renderer2
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Appends a child to a given parent node.
   *
   * @param parent  The parent element.
   * @param el      The child element.
   */
  appendChild(parent: HTMLElement, el: HTMLElement): void {
    return this.renderer.appendChild(parent, el);
  }

  /**
   * Gets a (unique) element by its id
   *
   * @param id  The element id.
   * @param el  The html element.
   */
  getElementById(id: string): HTMLElement {
    return this.document.getElementById(id);
  }

  /**
   * Creates an HTML element specified by tagName and if a parent is given appends it to a parent element.
   *
   * @param tagName The type of element to be created, e.g. 'div'
   * @param parent  The parent element.
   * @returns       The created element.
   */
  createElement<T extends HTMLElement>(tagName: string, parent?: HTMLElement): T {
    const el: T = this.renderer.createElement(tagName);
    if (parent) {
      this.appendChild(parent, el);
    }
    return el;
  }

  /**
   *  Returns the first element within the document that matches the specified selector. If no matches are found a new element is created.
   *
   * @param selector  A valid CSS selector string.
   * @param tagName   The type of element to be created if no element is found.
   * @param parent    The parent element for the element to be created.
   * @returns         Either the found or created element.
   */
  getOrCreateElement<T extends HTMLElement>(selector: string, tagName: string, parent?: HTMLElement): T {
    const el: T = this.document.querySelector(selector);
    return el ? el : this.createElement<T>(tagName, parent);
  }

  /**
   * Sets an attribute value for an element in the DOM.
   *
   * @param el              The element.
   * @param attributeName   The attribute name.
   * @param value           The value to be set.
   */
  setAttribute(el: HTMLElement, attributeName: string, value: string): void {
    this.renderer.setAttribute(el, attributeName, value);
  }

  /**
   * Sets an attribute value for the first element in the DOM that matches the specified selector. If no matches are found nothing is done.
   *
   * @param selector  A valid CSS selector string.
   * @param attributeName   The attribute name.
   * @param value           The value to be set.
   */
  setAttributeForSelector(selector: string, attributeName: string, value: string) {
    const el: HTMLElement = this.document.querySelector(selector);
    if (el) {
      this.setAttribute(el, attributeName, value);
    }
  }

  /**
   * Sets the value of a property of an element in the DOM.
   *
   * @param el              The element.
   * @param name            The property name.
   * @param value           The value to be set.
   */
  setProperty(el: HTMLElement, name: string, value: string | boolean): void {
    return this.renderer.setProperty(el, name, value);
  }

  // not-dead-code
  /**
   * Sets the value of a css variable.
   * ToDo: remove the notDeadCode comment as soon as setCssVariable method is used
   *
   * @param variableName    The name of the variable (without prefix '--').
   * @param value           The value to be set.
   */
  setCssVariable(variableName: string, value: string): void {
    this.renderer.setStyle(
      this.document.documentElement,
      `--${variableName.toLowerCase()}`,
      value.toString(),
      RendererStyleFlags2.DashCase
    );
  }

  /**
   * Adds a class to an element in the DOM.
   *
   * @param el              The element.
   * @param cssClass        The class name.
   */
  addClass(el: HTMLElement, cssClass: string): void {
    if (el) {
      this.renderer.addClass(el, cssClass);
    }
  }

  /**
   * Removes a class from an element in the DOM.
   *
   * @param el              The element.
   * @param cssClass        The class name.
   */
  removeClass(el: HTMLElement, cssClass: string) {
    if (el) {
      this.renderer.removeClass(el, cssClass);
    }
  }
}
