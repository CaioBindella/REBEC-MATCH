"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MensagensController = void 0;
const MensagemSchema_1 = require("../schemas/MensagemSchema");
const database_1 = __importDefault(require("../config/database"));
class MensagensController {
    constructor(io) {
        this.io = io;
    }
    async create(req, res) {
        const data = MensagemSchema_1.createMensagemSchema.parse(req.body);
        try {
            const result = await database_1.default.query(`INSERT INTO "Mensagem" ("autorId", "leitorId", "conteudo") 
                 VALUES ($1, $2, $3) RETURNING *`, [data.autorId, data.leitorId, data.conteudo]);
            const novaMensagem = result.rows[0];
            // Envia para o destinatário (leitorId) e autorId (opcional)
            this.io.to(`user-${data.leitorId}`).emit('nova-mensagem', novaMensagem);
            this.io.to(`user-${data.autorId}`).emit('mensagem-enviada', novaMensagem);
            res.status(201).json(novaMensagem);
        }
        catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async MensagesList(req, res) {
        const { usuario1, usuario2 } = req.params;
        try {
            const result = await database_1.default.query(`SELECT * FROM "Mensagem"
                 WHERE ("autorId" = $1 AND "leitorId" = $2)
                    OR ("autorId" = $2 AND "leitorId" = $1)
                 ORDER BY data_envio ASC`, [usuario1, usuario2]);
            res.json(result.rows);
        }
        catch (error) {
            console.error('Erro ao buscar conversas:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
exports.MensagensController = MensagensController;
