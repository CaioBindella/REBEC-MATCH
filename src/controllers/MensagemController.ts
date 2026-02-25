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
            // 1. Faz o INSERT no MySQL (substituindo $1 por ?)
            const [result]: any = await pool.query(
                `INSERT INTO mensagem (autor_id, leitor_id, estudo_id, conteudo, data_envio) 
                 VALUES (?, ?, ?, ?, NOW())`,
                [data.autorId, data.leitorId, data.estudoId, data.conteudo]
            );

            // 2. Pega o ID da mensagem que acabou de ser inserida
            const insertId = result.insertId;

            // 3. Faz um SELECT para buscar a mensagem completa recém-criada
            const [rows]: any = await pool.query(
                `SELECT * FROM mensagem WHERE id = ?`,
                [insertId]
            );

            const novaMensagem = rows[0];

            // Envia via Socket para o destinatário e remetente
            this.io.to(`user-${data.leitorId}`).emit('nova-mensagem', novaMensagem);
            this.io.to(`user-${data.autorId}`).emit('mensagem-enviada', novaMensagem);

            res.status(201).json(novaMensagem);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async MensagesList(req: Request, res: Response): Promise<void> {
        // Recebe o Estudo e os dois usuários envolvidos no chat
        const { estudoId, usuario1, usuario2 } = req.params;

        try {
            // Consulta no MySQL
            const [rows]: any = await pool.query(
                `SELECT * FROM mensagem 
                 WHERE estudo_id = ? 
                   AND ((autor_id = ? AND leitor_id = ?) 
                    OR (autor_id = ? AND leitor_id = ?))
                 ORDER BY data_envio ASC`,
                [estudoId, usuario1, usuario2, usuario2, usuario1]
            );

            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}