export type ViewType<T extends string = ''> = T | ('grid' | 'list');

export type DeviceType<T extends string = ''> = T | ('mobile' | 'tablet' | 'desktop');

export const headerTypes = <const>['simple', 'error', 'checkout'];

export type HeaderType = (typeof headerTypes)[number];
