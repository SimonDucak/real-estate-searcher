import z from 'zod';
import { PositionSchema } from './Position';
import { isObject } from '@/utils/typeof';

export enum AdvertiseType {
    SALE = 'sale',
    RENT = 'rent',
}

export const AdvertiseTypeSchema = z.nativeEnum(AdvertiseType);

export const AdvertiseSchema = z.object({
    title: z.string().default(''),
    address: z.string().default(''),
    rooms: z.number().nullable().default(null),
    meters: z.number().nullable().default(null),
    totalPrice: z.number().nullable().default(null),
    meterSquarePrice: z.number().nullable().default(null),
    link: z.string().nullable().default(null),
    imagesUrls: z.array(z.string()).default([]),
    position: PositionSchema.nullable().default(null),
    type: AdvertiseTypeSchema.default(AdvertiseType.SALE),
});

export type Advertise = z.infer<typeof AdvertiseSchema>;

export const advertiseParser = (data: unknown, type: AdvertiseType): Advertise | null => {
    if (!isObject(data)) return null;

    const mappedObject = {
        ...data,
        position: { lat: data.coors[1], lng: data.coors[0] },
        type,
    };

    try {
        return AdvertiseSchema.parse(mappedObject);
    } catch (error) {
        return null;
    }
}