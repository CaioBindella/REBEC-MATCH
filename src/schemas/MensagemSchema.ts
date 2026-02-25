import { z } from 'zod';

export const createMensagemSchema = z.object({
    autorId: z.number(),
    leitorId: z.number(),
    estudoId: z.number(),
    conteudo: z.string(),
});