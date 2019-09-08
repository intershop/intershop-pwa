export interface SfeMetadata {
  id: string;
  displayName: string;
  displayType: string;
  renderObject: {
    id: string;
    domainId: string;
    type: string;
    parentPageletId?: string;
    parentPageletDomain?: string;
    pageletAssignmentId?: string;
  };
}

export interface SfeDomNode {
  name: string;
  children: SfeDomNode[];
  sfeMetadata?: SfeMetadata;
}

export interface SfeMetadataNode extends SfeMetadata {
  children: SfeMetadataNode[];
}

export interface DesignViewMessage {
  type: string;
  // tslint:disable-next-line:no-any
  payload?: any;
}
