export interface ServerConfigDataEntry {
  id: string;
  elements?: ServerConfigDataEntry[];
  [key: string]: string | boolean | string[] | ServerConfigDataEntry[];
}

export interface ServerConfigData {
  data: ServerConfigDataEntry[];
}
