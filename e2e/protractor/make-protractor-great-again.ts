import { $, promise } from 'protractor';
import { Page } from './pages/page.interface';

let currentPage: Page;

export function onPage<T extends Page>(type: { new (): T }): promise.Promise<string> {
  const expected = new type();
  currentPage = expected;
  // the isPresent() method is not used by intention, to get a better fail result:
  // with isPresent() the log will be 'flase is not true'"', but
  // with getTagName() logs like 'No element found using locator: By(css selector, ish-category-page)' will appear
  return $(expected.tag).getTagName();
}
export function at<T extends Page>(type: { new (): T }, callback: (page: T) => void) {
  expect(onPage(type)).toBeTruthy();
  callback(<T>currentPage);
}
