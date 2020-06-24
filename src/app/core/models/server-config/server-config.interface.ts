export interface ServerConfigDataEntry {
  [key: string]: string | boolean | number | string[] | ServerConfigDataEntry;
}

export interface ServerConfigData {
  data: ServerConfigDataEntry;
}
