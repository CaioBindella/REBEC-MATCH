import { z } from 'zod';

export const createUsuarioSchema = z.object({
  nome: z.string().min(1).max(50),
  sobrenome: z.string().min(1).max(50),
  login: z.string().min(1).max(50),
  email: z.string().email().min(1).max(100),
  senha: z.string().min(8).max(50),
  tipo: z.enum(['ADMIN', 'USER']),
  tipo_especifico: z.enum(['PESQUISADOR', 'VOLUNTARIO']),
  sexo: z.enum(['MASCULINO', 'FEMININO']),
  data_nascimento: z.coerce.date(),
  telefone: z.string().min(1).max(25),
  endereco: z.string().min(1).max(255),
  documento: z.string().min(1).max(25),
  tester: z.boolean().optional(),
});

export const loginUsuarioSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type LoginUsuarioDto = z.infer<typeof loginUsuarioSchema>;