/**
 * response data type for confirm data request
 */
export interface DataRequestData {
  data: [
    {
      hash: string;
    }
  ];
  infos?: DataRequestInfo[];
}

export interface DataRequestInfo {
  causes?: [
    {
      code: string;
    }
  ];
}
