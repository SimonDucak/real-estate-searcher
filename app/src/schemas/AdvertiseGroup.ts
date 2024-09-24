import z from 'zod';
import { PositionSchema } from './Position';
import { Advertise, AdvertiseSchema } from './Advertise';

export const AdvertiseGroupSchema = z.object({
    position: PositionSchema.nullable(),
    advertises: z.array(AdvertiseSchema),
});

export type AdvertiseGroup = z.infer<typeof AdvertiseGroupSchema>;

export const groupByPosition = (advertises: Advertise[]): AdvertiseGroup[] => {
    const map = new Map<string, AdvertiseGroup>();

    const getPositionKey = (adv: Advertise) => `${adv.position?.lat}-${adv.position?.lng}`;

    advertises.forEach((advertise) => {
        const key = getPositionKey(advertise);

        if (!map.has(key)) {
            map.set(key, { position: advertise.position, advertises: [] });
        }

        map.get(key)?.advertises.push(advertise);
    });

    return Array.from(map.values());
};