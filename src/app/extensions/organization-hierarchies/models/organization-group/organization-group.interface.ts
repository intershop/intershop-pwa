export interface OrganizationGroupData {
  attributes: {
    name: string;
    description?: string;
  };
  id: string;
  relationships: {
    parentNode?: {
      data: {
        id?: string;
      };
    };
  };
}
