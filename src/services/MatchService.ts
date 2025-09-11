import axios from 'axios';
import OpenAI from 'openai';
import { config } from '../config/env';
import { buildOpenAiPrompt } from '../config/prompts';
import { MatchData, MatchResultCreate, OpenAiResponse } from '../types/api.types';
import { encode } from 'gpt-3-encoder';

const openai = new OpenAI({ apiKey: config.openAiKey });

// Função para dividir um array em chunks (lotes) controlando o número de tokens.
function chunkJsonByTokens(items: any[], maxTokens = 3000): any[][] {
  const chunks: any[][] = [];
  let currentChunk: any[] = [];
  let currentTokens = 0;

  for (const item of items) {
    const itemTokens = encode(JSON.stringify(item)).length;

    if (currentTokens + itemTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentTokens = 0;
    }

    currentChunk.push(item);
    currentTokens += itemTokens;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

class MatchService {

  public async processMatch(userPrompt: string): Promise<MatchResultCreate[]> {
    const matchData = await this.fetchDataFromJavaApi();

    if (!matchData?.estudos?.length || !matchData?.voluntarios?.length) {
      console.log('Dados insuficientes para processar.');
      return [];
    }

    // Quebra em pedaços menores
    const volunteerChunks = chunkJsonByTokens(matchData.voluntarios, 2500);
    const studyChunks = chunkJsonByTokens(matchData.estudos, 2500);

    console.log(
      `Chunks: ${volunteerChunks.length} de voluntários, ${studyChunks.length} de estudos`
    );

    const allMatches: MatchResultCreate[] = [];

    // Processa cada combinação de chunks
    for (let v = 0; v < volunteerChunks.length; v++) {
      for (let s = 0; s < studyChunks.length; s++) {
        console.log(
          `Processando voluntários chunk ${v + 1}/${volunteerChunks.length}, estudos chunk ${s + 1}/${studyChunks.length}`
        );

        const dataForPrompt = {
          estudos: studyChunks[s],
          voluntarios: volunteerChunks[v],
        };

        const partialPrompt = buildOpenAiPrompt(userPrompt, dataForPrompt);
        const partialResult = await this.getMatchesFromOpenAI(partialPrompt);

        if (partialResult.matches) {
          allMatches.push(...partialResult.matches);
        }
      }
    }

    if (allMatches.length > 0) {
      await this.saveMatchesToJavaApi(allMatches);
    }

    return allMatches;
  }

  // Busca os dados da API Java. O tipo de retorno MatchData está correto.
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
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente que retorna APENAS um objeto JSON válido.' },
          { role: 'user', content: prompt },
        ],
      });

      const content = completion.choices[0].message.content;
      if (!content) return { matches: [] };

      try {
        return JSON.parse(content);
      } catch (err) {
        console.error('Erro ao parsear JSON da OpenAI:', err);
        return { matches: [] };
      }
    } catch (error) {
      console.error('Erro ao chamar a API da OpenAI:', error);
      throw new Error('Falha na comunicação com a OpenAI.');
    }
  }

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

