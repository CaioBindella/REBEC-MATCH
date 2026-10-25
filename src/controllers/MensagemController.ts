import { Response } from 'express';
import { Server } from 'socket.io';
import { createMensagemSchema, listarMensagensSchema } from '../schemas/MensagemSchema';
import { RequestAutenticada } from '../middlewares/auth';
import pool from '../config/database';

/**
 * O canal de conversa só existe entre o voluntário e o pesquisador responsável por um estudo
 * cuja candidatura foi concluída (match confirmado pelas duas partes).
 */
async function existeMatch(estudoId: number, usuarioA: number, usuarioB: number): Promise<boolean> {
    const [rows]: any = await pool.query(
        `SELECT 1
           FROM candidatura c
           JOIN voluntario v ON v.id = c.voluntario_id
           JOIN estudo e ON e.id = c.estudo_id
           JOIN pesquisador p ON p.id = e.pesquisador_id
          WHERE c.estudo_id = ?
            AND c.status = 'CONCLUIDO'
            AND ((v.usuario_id = ? AND p.usuario_id = ?) OR (v.usuario_id = ? AND p.usuario_id = ?))
          LIMIT 1`,
        [estudoId, usuarioA, usuarioB, usuarioB, usuarioA]
    );
    return rows.length > 0;
}

export class MensagensController {
    constructor(private readonly io: Server) {}

    async create(req: RequestAutenticada, res: Response): Promise<void> {
        const parsed = createMensagemSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.issues.map(i => i.message).join('; ') });
            return;
        }
        const autorId = req.usuario!.id;
        const { leitorId, estudoId, conteudo } = parsed.data;

        if (!(await existeMatch(estudoId, autorId, leitorId))) {
            res.status(403).json({ message: 'O chat só é liberado após a confirmação mútua (match) neste estudo.' });
            return;
        }

        const [result]: any = await pool.query(
            `INSERT INTO mensagem (autor_id, leitor_id, estudo_id, conteudo, data_envio)
             VALUES (?, ?, ?, ?, NOW())`,
            [autorId, leitorId, estudoId, conteudo]
        );
        const [rows]: any = await pool.query('SELECT * FROM mensagem WHERE id = ?', [result.insertId]);
        const novaMensagem = rows[0];

        await this.notificarDestinatario(leitorId, estudoId);

        // Entrega em tempo real aos dois participantes conectados via Socket.IO
        this.io.to(`user-${leitorId}`).emit('nova-mensagem', novaMensagem);
        this.io.to(`user-${autorId}`).emit('nova-mensagem', novaMensagem);

        res.status(201).json(novaMensagem);
    }

    async MensagesList(req: RequestAutenticada, res: Response): Promise<void> {
        const parsed = listarMensagensSchema.safeParse(req.params);
        if (!parsed.success) {
            res.status(400).json({ message: 'Parâmetros inválidos.' });
            return;
        }
        const { estudoId, usuario1, usuario2 } = parsed.data;
        const meuId = req.usuario!.id;

        if (meuId !== usuario1 && meuId !== usuario2) {
            res.status(403).json({ message: 'Você só pode acessar as suas próprias conversas.' });
            return;
        }
        if (!(await existeMatch(estudoId, usuario1, usuario2))) {
            res.status(403).json({ message: 'O chat só é liberado após a confirmação mútua (match) neste estudo.' });
            return;
        }

        // Registra a leitura das mensagens recebidas pelo usuário que abriu a conversa
        await pool.query(
            `UPDATE mensagem SET data_leitura = NOW()
              WHERE estudo_id = ? AND leitor_id = ? AND data_leitura IS NULL`,
            [estudoId, meuId]
        );

        const [rows]: any = await pool.query(
            `SELECT * FROM mensagem
              WHERE estudo_id = ?
                AND ((autor_id = ? AND leitor_id = ?) OR (autor_id = ? AND leitor_id = ?))
              ORDER BY data_envio ASC, id ASC`,
            [estudoId, usuario1, usuario2, usuario2, usuario1]
        );
        res.json(rows);
    }

    /**
     * Cria na central de notificações um aviso de nova mensagem, sem repetir o aviso enquanto o
     * anterior do mesmo estudo ainda não tiver sido lido.
     */
    private async notificarDestinatario(leitorId: number, estudoId: number): Promise<void> {
        try {
            const [estudos]: any = await pool.query('SELECT public_title FROM estudo WHERE id = ?', [estudoId]);
            const mensagem = `Você recebeu uma nova mensagem no estudo ${estudos[0]?.public_title ?? estudoId}.`;
            const [pendentes]: any = await pool.query(
                `SELECT 1 FROM notificacoes WHERE usuario_id = ? AND titulo = 'Nova Mensagem' AND mensagem = ? AND lida = FALSE LIMIT 1`,
                [leitorId, mensagem]
            );
            if (pendentes.length === 0) {
                await pool.query(
                    `INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo, lida, data_criacao)
                     VALUES (?, 'Nova Mensagem', ?, 'info', FALSE, NOW())`,
                    [leitorId, mensagem]
                );
            }
        } catch (error) {
            // A falha ao notificar não impede a entrega da mensagem
            console.warn('Falha ao registrar notificação de nova mensagem:', error);
        }
    }
}
