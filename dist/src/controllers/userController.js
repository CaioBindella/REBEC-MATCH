"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const registerSchema = zod_1.z.object({
    nome: zod_1.z.string().min(1).max(50),
    sobrenome: zod_1.z.string().min(1).max(50),
    login: zod_1.z.string().min(1).max(50),
    email: zod_1.z.string().email().min(1).max(100),
    senha: zod_1.z.string().min(8).max(50),
    tipo: zod_1.z.enum(['ADMIN', 'USER']),
    tipo_especifico: zod_1.z.enum(['PESQUISADOR', 'VOLUNTARIO']),
    sexo: zod_1.z.enum(['MASCULINO', 'FEMININO']),
    data_nascimento: zod_1.z.coerce.date(),
    telefone: zod_1.z.string().min(1).max(25),
    endereco: zod_1.z.string().min(1).max(255),
    documento: zod_1.z.string().min(1).max(25),
    tester: zod_1.z.boolean().optional(),
});
const loginSchema = zod_1.z.object({
    login: zod_1.z.string().min(1),
    senha: zod_1.z.string().min(8),
});
class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = registerSchema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({ error: result.error.format() });
                return;
            }
            const { nome, sobrenome, login, email, senha, tipo, tipo_especifico, sexo, data_nascimento, telefone, endereco, documento, tester } = result.data;
            // Verificar tester antes de criar o usuário
            if (typeof tester !== 'boolean') {
                res.status(400).json({ error: 'Campo "tester" deve ser booleano.' });
                return;
            }
            const existing = yield prisma.usuario.findFirst({
                where: { OR: [{ email }, { login }] }
            });
            if (existing) {
                res.status(400).json({ message: 'Email ou login já cadastrado' });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(senha, 10);
            try {
                const user = yield prisma.usuario.create({
                    data: Object.assign(Object.assign({ nome,
                        sobrenome,
                        login,
                        email, senha: hashedPassword, tipo,
                        sexo,
                        data_nascimento,
                        telefone,
                        endereco,
                        documento,
                        tester }, (tipo_especifico === 'PESQUISADOR' && {
                        pesquisador: {
                            create: {} // Pesquisador não tem campos obrigatórios
                        }
                    })), (tipo_especifico === 'VOLUNTARIO' && {
                        voluntario: {
                            create: {
                                distancia: 0 // Campo obrigatório para Voluntario
                            }
                        }
                    }))
                });
                const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ user, token });
            }
            catch (error) {
                console.error('Erro ao criar usuário:', error);
                res.status(500).json({ error: 'Erro interno ao criar usuário' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = loginSchema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({ error: result.error.format() });
                return;
            }
            const { login, senha } = result.data;
            const user = yield prisma.usuario.findUnique({ where: { login } });
            if (!user || !(yield bcryptjs_1.default.compare(senha, user.senha))) {
                res.status(401).json({ message: 'Credenciais inválidas' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, login: user.login, email: user.email, tipo: user.tipo }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ user, token });
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const user = yield prisma.usuario.findUnique({ where: { id: userId } });
            res.status(200).json({ user });
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.id);
            yield prisma.usuario.update({ where: { id: userId }, data: req.body });
            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.id);
            yield prisma.usuario.delete({ where: { id: userId } });
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        });
    }
    listUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma.usuario.findMany();
            res.status(200).json({ users });
        });
    }
}
exports.UserController = UserController;
