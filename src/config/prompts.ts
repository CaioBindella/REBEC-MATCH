// A função recebe os dados e retorna o prompt completo como string.
export function buildOpenAiPrompt(userPrompt: string, matchData: any): string {
  const dadosJson = JSON.stringify(matchData, null, 2);

  return `${userPrompt}

Com base nos dados JSON fornecidos abaixo, gere as combinações.
Sua resposta DEVE ser um objeto JSON contendo uma única chave chamada 'matches'.
O valor dessa chave deve ser um array de objetos, onde cada objeto representa um match e contém EXATAMENTE as seguintes chaves: 'voluntario_id' (Integer), 'estudo_id' (Integer), 'criterios_atendidos' (Integer), e 'justificativa' (String, descrevendo brevemente por que o match foi feito e quais critérios foram importantes).
NÃO inclua nenhuma explicação, texto ou formatação fora deste objeto JSON.

Exemplo de formato de saída esperado:
{
  "matches": [
    {
      "voluntario_id": 101,
      "estudo_id": 22,
      "criterios_atendidos": 5,
      "justificativa": "Voluntário atende aos critérios de idade e gênero, e suas respostas indicam compatibilidade com o foco do estudo em saúde mental."
    }
  ]
}

Agora, analise os seguintes dados:
${dadosJson}`;
}