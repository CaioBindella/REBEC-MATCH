"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMensagemSchema = void 0;
const zod_1 = require("zod");
exports.createMensagemSchema = zod_1.z.object({
    autorId: zod_1.z.number(),
    leitorId: zod_1.z.number(),
    conteudo: zod_1.z.string(),
});
