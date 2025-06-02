import { Request, Response } from 'express';
import { createMensagemSchema } from '../schemas/MensagemSchema';
import pool from '../config/database';

export class MensagensController {
    io: any;

    constructor(io: any) {
        this.io = io;
    }

    async create(req: Request, res: Response): Promise<void> {
        const data = createMensagemSchema.parse(req.body);

        try {
            const result = await pool.query(
                `INSERT INTO "Mensagem" ("autorId", "leitorId", "conteudo") 
                 VALUES ($1, $2, $3) RETURNING *`,
                [data.autorId, data.leitorId, data.conteudo]
            );

            const novaMensagem = result.rows[0];

            // Envia para o destinatário (leitorId) e autorId (opcional)
            this.io.to(`user-${data.leitorId}`).emit('nova-mensagem', novaMensagem);
            this.io.to(`user-${data.autorId}`).emit('mensagem-enviada', novaMensagem);

            res.status(201).json(novaMensagem);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async MensagesList(req: Request, res: Response): Promise<void> {
        const { usuario1, usuario2 } = req.params;

        try {
            const result = await pool.query(
                `SELECT * FROM "Mensagem"
                 WHERE ("autorId" = $1 AND "leitorId" = $2)
                    OR ("autorId" = $2 AND "leitorId" = $1)
                 ORDER BY data_envio ASC`,
                [usuario1, usuario2]
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
