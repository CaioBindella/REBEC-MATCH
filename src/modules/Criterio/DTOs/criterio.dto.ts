import { z } from 'zod';

export const createCriterioSchema = z.object({
    texto: z.string(),
    buscaId: z.number(),
});

export type CreateCriterioDto = z.infer<typeof createCriterioSchema>;