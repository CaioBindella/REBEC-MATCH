import axios from 'axios';
import OpenAI from 'openai';
import { config } from '../config/env';
import { buildOpenAiPrompt } from '../config/prompts';
import { MatchData, MatchResultCreate, OpenAiResponse } from '../types/api.types';

const openai = new OpenAI({
  apiKey: config.openAiKey,
});

class MatchService {
  
  // Orquestra todo o fluxo
  public async processMatch(userPrompt: string): Promise<MatchResultCreate[]> {
    // 1. Busca os dados da API Java
    const matchData = await this.fetchDataFromJavaApi();

    // 2. Constrói o prompt e busca os matches na OpenAI
    const fullPrompt = buildOpenAiPrompt(userPrompt, matchData);
    const openAiResult = await this.getMatchesFromOpenAI(fullPrompt);

    if (!openAiResult.matches || openAiResult.matches.length === 0) {
      console.log('Nenhum match retornado pela OpenAI.');
      return [];
    }

    // 3. Salva cada match de volta na API Java
    await this.saveMatchesToJavaApi(openAiResult.matches);
    
    return openAiResult.matches;
  }

  // Método privado para buscar dados da API Java
  private async fetchDataFromJavaApi(): Promise<MatchData> {
    try {
      console.log('Buscando dados da API Java...');
      const response = await axios.get<MatchData>(`${config.javaApiBaseUrl}/api/v1/match/dados`);
      console.log('Dados da API Java recebidos.');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados da API Java:', error);
      throw new Error('Não foi possível obter os dados da API Java.');
    }
  }

  private async getMatchesFromOpenAI(prompt: string): Promise<OpenAiResponse> {
    try {
      console.log('Enviando requisição para a OpenAI com a biblioteca oficial...');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente que retorna APENAS um objeto JSON válido.' },
          { role: 'user', content: prompt },
        ],
      });

      const content = completion.choices[0].message.content;
      console.log('Resposta da OpenAI recebida.');
      
      if (!content) {
        throw new Error('A resposta da OpenAI veio vazia.');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new Error('Falha na comunicação com a OpenAI.');
    }
  }

  // Método privado para salvar os resultados
  private async saveMatchesToJavaApi(matches: MatchResultCreate[]): Promise<void> {
    console.log(`Salvando ${matches.length} matches na API Java...`);
    
    const savePromises = matches.map(match => 
      axios.post(`${config.javaApiBaseUrl}/api/v1/match/save`, match)
    );
    
    try {
      await Promise.all(savePromises);
      console.log('Todos os matches foram salvos com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar matches na API Java:', error);
      throw new Error('Falha ao salvar um ou mais matches na API Java.');
    }
  }
}

export default new MatchService();