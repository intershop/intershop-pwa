export interface ServerConfigDataEntry {
  id: string;
  elements?: ServerConfigDataEntry[];
  [key: string]: string | boolean | number | string[] | ServerConfigDataEntry[];
}

export interface ServerConfigData {
  data: ServerConfigDataEntry[];
}
