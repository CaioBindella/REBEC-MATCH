import { z } from 'zod';

export const createEstudoSchema = z.object({
    titulo: z.string(),
    pesquisadorId: z.number(),
    codigoRegistro: z.string(),
    status: z.string(),
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
    informacoesGerais: z.string(),
});

export type CreateEstudoDto = z.infer<typeof createEstudoSchema>;