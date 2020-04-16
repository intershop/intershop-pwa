import b64u from 'b64u';

import { SearchParameter } from './search-parameter.model';

export class SearchParameterMapper {
  /*
    Converts the searchParameter to a base64 encoded string
  */
  static toData(searchParameter: SearchParameter): string {
    let data = '';

    if (searchParameter.queryTerm) {
      data += '&@QueryTerm=' + searchParameter.queryTerm;
    }
    if (searchParameter.data) {
      data += searchParameter.data;
    }
    if (searchParameter.sortings) {
      searchParameter.sortings.forEach(sorting => {
        if (sorting.endsWith('-asc')) {
          data += `&@Sort.${sorting.substr(0, sorting.length - '-asc'.length)}=0`;
        }
        if (sorting.endsWith('-desc')) {
          data += `&@Sort.${sorting.substr(0, sorting.length - '-desc'.length)}=1`;
        }
      });
    }
    return b64u.toBase64(b64u.encode(data));
  }
}
