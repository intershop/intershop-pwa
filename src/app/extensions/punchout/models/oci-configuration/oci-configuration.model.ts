export interface OciConfiguration {
  name: string;
  type: string;
  field: string;
  transform: string;
  formatter: string;
  mappings: [
    {
      name: string;
      type: string;
      mapFromValue: string;
      mapToValue: string;
    }
  ];
}
