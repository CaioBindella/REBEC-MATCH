// Baseado no MatchDataDTO.java
export interface MatchData {
  estudos: any[];      // Defina tipos mais específicos se souber a estrutura
  voluntarios: any[]; // Defina tipos mais específicos se souber a estrutura
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