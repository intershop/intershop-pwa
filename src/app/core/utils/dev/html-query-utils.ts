import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

function getAllElementTagsRecursively(el: Element) {
  const returnList: string[] = [];
  returnList.push(el.tagName);

  for (let index = 0; index < el.children.length; index++) {
    const cel = el.children[index];
    returnList.push(...getAllElementTagsRecursively(cel));
  }
  return returnList;
}

export function findAllCustomElements(el: HTMLElement): string[] {
  const returnList = [];
  const tagList = getAllElementTagsRecursively(el);

  for (let index = 0; index < tagList.length; index++) {
    const element = tagList[index];
    const tagName = element.toLocaleLowerCase();
    // https://stackoverflow.com/a/47737765/13001898
    if (!tagName.includes('-')) {
      continue;
    }
    returnList.push(tagName);
  }

  return returnList;
}

export function findAllDataTestingIDs(fixture: ComponentFixture<unknown>): string[] {
  return fixture.debugElement.queryAll(By.css('[data-testing-id]')).map(el => el.attributes['data-testing-id']);
}

export function createDocumentFromHTML(html: string): HTMLDocument {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}
