import { z } from 'zod';

export const createBuscaSchema = z.object({
    nome: z.string(),
    pesquisadorId: z.number(),
});

export type CreateBuscaDto = z.infer<typeof createBuscaSchema>;