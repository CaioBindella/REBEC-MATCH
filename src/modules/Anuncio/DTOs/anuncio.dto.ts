import { z } from 'zod';

export const createAnuncioSchema = z.object({
    mensagem: z.string(),
    data_expiracao: z.coerce.date(),
    buscaId: z.number(),
});

export type CreateAnuncioDto = z.infer<typeof createAnuncioSchema>;