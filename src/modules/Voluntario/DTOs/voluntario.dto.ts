import { z } from 'zod';

export const createVoluntarioSchema = z.object({
    nomeFicticio: z.string(),
    distancia: z.number(),
    usuarioId: z.number(),
});

export type CreateVoluntarioDto = z.infer<typeof createVoluntarioSchema>;