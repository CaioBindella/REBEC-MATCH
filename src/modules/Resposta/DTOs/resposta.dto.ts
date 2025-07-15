import { z } from 'zod';

export const createRespostaSchema = z.object({
    conteudo: z.string(),
    marcado: z.boolean(),
    voluntarioId: z.number(),
    busca_id: z.number(),
    questaoId: z.number(),
});

export type CreateRespostaDto = z.infer<typeof createRespostaSchema>;