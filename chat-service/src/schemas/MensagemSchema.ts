import { z } from 'zod';

// O autor da mensagem é sempre o usuário autenticado pelo token
export const createMensagemSchema = z.object({
    leitorId: z.number().int().positive(),
    estudoId: z.number().int().positive(),
    conteudo: z.string().trim().min(1, 'A mensagem não pode ser vazia.').max(2000, 'A mensagem deve ter no máximo 2000 caracteres.'),
});

export const listarMensagensSchema = z.object({
    estudoId: z.coerce.number().int().positive(),
    usuario1: z.coerce.number().int().positive(),
    usuario2: z.coerce.number().int().positive(),
});
