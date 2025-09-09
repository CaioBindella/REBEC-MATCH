import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

class MatchController {
  public async handle(req: Request, res: Response): Promise<Response> {
    try {
      // O prompt pode vir do corpo da requisição
      const userPrompt = req.body.prompt || 'Faça as melhores combinações possíveis.';

      const savedMatches = await MatchService.processMatch(userPrompt);

      if (savedMatches.length === 0) {
        return res.status(200).json({ message: 'Processo concluído, nenhum match foi gerado.' });
      }

      return res.status(200).json({
        message: 'Processo de match concluído com sucesso!',
        matchesSalvos: savedMatches.length,
        dados: savedMatches,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      console.error('Erro no MatchController:', errorMessage);
      return res.status(500).json({ error: 'Falha ao executar o processo de match.', details: errorMessage });
    }
  }
}

export default new MatchController();