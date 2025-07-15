import { z } from 'zod';

export const createPesquisadorSchema = z.object({
    nomeFicticio: z.string(),
    usuarioId: z.number(),
});

export type CreatePesquisadorDto = z.infer<typeof createPesquisadorSchema>;