import z from 'zod';

export const PositionSchema = z.object({
    lat: z.number(),
    lng: z.number(),
});

export type Position = z.infer<typeof PositionSchema>;