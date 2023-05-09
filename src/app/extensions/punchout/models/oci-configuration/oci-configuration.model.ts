export interface OciConfiguration {
  type: string;
  field: string;
  transform: string;
  formatter: string;
  mappings?: [
    {
      mapFromValue: string;
      mapToValue: string;
    }
  ];
}
