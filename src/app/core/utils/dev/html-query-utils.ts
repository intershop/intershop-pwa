function getAllElementTagsRecursively(el: Element): string[] {
  const returnList = [];
  returnList.push(el.tagName);

  for (let index = 0; index < el.children.length; index++) {
    const cel = el.children[index];
    returnList.push(...getAllElementTagsRecursively(cel));
  }
  return returnList;
}

export function findAllIshElements(el: HTMLElement): string[] {
  const returnList = [];
  const tagList = getAllElementTagsRecursively(el);

  for (let index = 0; index < tagList.length; index++) {
    const element = tagList[index];
    const tagName = element.toLocaleLowerCase();
    if (!tagName.startsWith('ish-')) {
      continue;
    }
    returnList.push(tagName);
  }

  return returnList.sort();
}
