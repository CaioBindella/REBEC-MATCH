import { z } from 'zod';

export const createQuestaoSchema = z.object({
    texto: z.string(),
    tipo: z.enum(['texto', 'opcoes']),
    opcoes: z.array(z.string()).optional(),
    obrigatorio: z.boolean().optional().default(false),
    formularioId: z.number(),
});

export type CreateQuestaoDto = z.infer<typeof createQuestaoSchema>;