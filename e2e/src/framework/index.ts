// tslint:disable no-barrel-files
import { $, promise } from 'protractor';

interface Page {
  tag: string;
}

let currentPage: Page;

function onPage<T extends Page>(page: { new (): T }): promise.Promise<string> {
  currentPage = new page();
  return $(currentPage.tag).getTagName();
}
export function at<T extends Page>(type: { new (): T }, callback?: (page: T) => void) {
  expect(onPage(type)).toBeTruthy();
  if (callback) {
    callback(currentPage as T);
  }
}
