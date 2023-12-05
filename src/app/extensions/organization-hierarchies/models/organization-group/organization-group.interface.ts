export interface OrganizationGroupData {
  attributes: {
    name: string;
    description?: string;
  };
  id: string;
  relationships: {
    parentGroup?: {
      data: {
        id?: string;
      };
    };
  };
}
