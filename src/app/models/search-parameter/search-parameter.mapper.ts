import { SearchParameter } from './search-parameter.model';

export class SearchParameterMapper {
  /*
    Converts base64 encoded parameter string into a SearchParameter object
  */
  static fromData(data: string): SearchParameter {
    const searchParameter = new SearchParameter();
    const decodedData = atob(data);

    const terms = decodedData.split('&');
    terms.forEach(term => {
      const parts = term.split('=');
      if (parts.length !== 2) {
        return;
      }

      const paramName = parts[0];
      const paramValue = parts[1];

      if ('@QueryTerm' === paramName) {
        searchParameter.queryTerm = paramValue;
      } else if (paramName.startsWith('@Sort.')) {
        let name = paramName.substr('@Sort.'.length, paramName.length);
        if (paramValue === '0') {
          name += '-asc';
        }
        if (paramValue === '1') {
          name += '-desc';
        }

        const sortings = [name];
        if (searchParameter.sortings) {
          searchParameter.sortings.concat(sortings);
        } else {
          searchParameter.sortings = sortings;
        }
      } else {
        searchParameter.data += '&' + paramName + '=' + paramValue;
      }
    });

    return searchParameter;
  }

  /*
    Converts the searchParameter to a base64 encoded string
  */
  static toData(searchParameter: SearchParameter): string {
    let data = '';

    if (searchParameter.queryTerm) {
      data += '&' + '@QueryTerm=' + searchParameter.queryTerm;
    }
    if (searchParameter.data) {
      data += searchParameter.data;
    }
    if (searchParameter.sortings) {
      searchParameter.sortings.forEach(sorting => {
        if (sorting.endsWith('-asc')) {
          data += '&@Sort.' + sorting.substr(0, sorting.length - '-asc'.length) + '=0';
        }
        if (sorting.endsWith('-desc')) {
          data += '&@Sort.' + sorting.substr(0, sorting.length - '-desc'.length) + '=1';
        }
      });
    }
    return btoa(data);
  }
}
