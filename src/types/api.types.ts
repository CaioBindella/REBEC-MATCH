// Baseado no MatchDataDTO.java
export interface MatchData {
  estudos: any[];
  voluntarios: any[];
}

// Baseado no MatchResultCreateDTO.java
export interface MatchResultCreate {
  voluntario_id: number;
  estudo_id: number;
  criterios_atendidos: number;
  justificativa: string;
}

export interface OpenAiResponse {
  matches: MatchResultCreate[];
}