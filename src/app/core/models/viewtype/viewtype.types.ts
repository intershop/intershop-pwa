export type ViewType<T extends string = ''> = ('grid' | 'list') | T;

export type DeviceType<T extends string = ''> = ('desktop' | 'mobile' | 'tablet') | T;

export const headerTypes = ['simple', 'error', 'checkout'] as const;

export type HeaderType = (typeof headerTypes)[number];
