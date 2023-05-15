export interface OciConfigurationItem {
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
