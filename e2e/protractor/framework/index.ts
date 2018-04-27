// tslint:disable no-barrel-files
import { $, promise } from 'protractor';

interface Page {
  tag: string;
}

let currentPage: Page;

function onPage<T extends Page>(page: { new (): T }): promise.Promise<string> {
  currentPage = new page();
  // the isPresent() method is not used by intention, to get a better fail result:
  // with isPresent() the log will be 'flase is not true'"', but
  // with getTagName() logs like 'No element found using locator: By(css selector, ish-category-page)' will appear
  return $(currentPage.tag).getTagName();
}
export function at<T extends Page>(type: { new (): T }, callback: (page: T) => void) {
  expect(onPage(type)).toBeTruthy();
  callback(<T>currentPage);
}
