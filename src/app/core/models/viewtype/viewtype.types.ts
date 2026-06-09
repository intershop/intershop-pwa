export type ViewType<T extends string = ''> = ('grid' | 'list') | T;

export type DeviceType<T extends string = ''> = ('desktop' | 'mobile' | 'tablet') | T;

export const headerTypes = <const>['simple', 'error', 'checkout'];

export type HeaderType = (typeof headerTypes)[number];
