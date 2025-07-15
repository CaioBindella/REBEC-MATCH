import { z } from 'zod';

export const createFormularioSchema = z.object({
    titulo: z.string(),
    texto_para_resposta_livre: z.string(),
    data_criacao: z.coerce.date(),
    estudoId: z.number(),
});

export type CreateFormularioDto = z.infer<typeof createFormularioSchema>;