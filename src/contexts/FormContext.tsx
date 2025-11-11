'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FormData, formSchema } from '@/lib/schema';

// --- Tipos para o Reducer ---
type State = FormData;
type Action = { type: 'UPDATE_FORM'; payload: Partial<FormData> };

// --- Contexto ---
interface FormContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const FormContext = createContext<FormContextProps | undefined>(undefined);

// --- Reducer: Lógica para atualizar o estado ---
const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_FORM':
      const newState = { ...state, ...action.payload };

      // Merge profundo para objetos aninhados
      if (action.payload.identificacaoInstitucional) {
        newState.identificacaoInstitucional = {
          ...state.identificacaoInstitucional,
          ...action.payload.identificacaoInstitucional,
        };
      }
      if (action.payload.pessoal) {
        newState.pessoal = { ...state.pessoal, ...action.payload.pessoal };
      }
      // NOVO: Merge para atuacao
      if (action.payload.atuacao) {
        newState.atuacao = { ...state.atuacao, ...action.payload.atuacao };
      }
      
      // Arrays (como equipe) são substituídos inteiramente
      if (action.payload.equipe) {
        newState.equipe = action.payload.equipe;
      }
      
      return newState;
    default:
      return state;
  }
};

export const getInitialState = (): State => {
  const defaultState: State = {
    identificacaoInstitucional: {
      // (conteúdo de identificacaoInstitucional)
      centro: {
        razaoSocial: '', nomeCpec: '', cnpj: '', cnes: '',
        endereco: { cep: '', logradouro: '', numero: '', bairro: '', municipio: '', uf: '' },
        emails: [{ value: '' }], telefones: [], website: '', midiasSociais: [], anoFundacao: '',
      },
      vinculacao: {
        comiteEtica: '', nomeInstituicao: '', cnpjInstituicao: '', cnesInstituicao: '',
        enderecoInstituicao: { cep: '', logradouro: '', numero: '', bairro: '', municipio: '', uf: '' },
        emailInstituicao: '',
      },
    },
    pessoal: {
      direcaoClinica: { nome: '', lattes: '', documento: '' },
      representanteLegal: { nome: '', lattes: '', documento: '' },
    },
    equipe: [
      { nome: '', formacao: '', funcao: '', lattes: '', documento: '' },
    ],
    atuacao: {
      tiposEstudo: [],
      atividadesPesquisa: [{ 
        codigoPrefixo: '', 
        codigoNumeracao: '', 
        titulo: '', 
        tipo: '', 
        especialidade: '', 
        ano: '' 
      }],
      especialidadesSaude: [],
      outrasEspecialidades: [],
    },
    infraestrutura: {
      equipamentos: [{ nome: '', modelo: '', quantidade: '' }],
      relacao_orpc: undefined, // Começa vazio para forçar seleção
      instalacoes_especificas: '',
      modelagem_orpc: [], // Começa vazio
    },
    capacitacaoConformidade: {
      numero_inspecoes_5anos: '',
      possui_profissionais_regulatorios: undefined, // Começa indefinido
      certificacoesNacionais: [{ nome: '', link_documento: '' }], // Começa com um item
      certificacoesInternacionais: [{ nome: '', link_documento: '' }], // Começa com um item
    },
    financiamentoSustentabilidade: {
      orcamentosAnuais: [{ // Começa com um orçamento
        ano: '', orcamento: '', percentual_pesquisa_clinica: '', percentual_capital: '', 
        percentual_custeio: '', percentual_financiamento_privado: '', percentual_financiamento_publico: ''
      }],
      praticasFinanceiras: [],
      praticasAmbientais: [],
      praticasSociais: [],
    },
  };

  // Tenta carregar do localStorage
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('formData');
    try {
      if (savedState) {
        // Usamos partial() para não quebrar se um schema novo for adicionado
        const parsedState = formSchema.partial().parse(JSON.parse(savedState));
        
        // Merge profundo para garantir que todos os níveis de default existam
        const mergedState = {
          ...defaultState,
          ...parsedState,
          identificacaoInstitucional: {
            ...defaultState.identificacaoInstitucional,
            ...parsedState.identificacaoInstitucional,
          },
          pessoal: {
            ...defaultState.pessoal,
            ...parsedState.pessoal,
          },
          // NOVO: Merge para atuacao
          atuacao: {
            ...defaultState.atuacao,
            ...parsedState.atuacao,
          },
          equipe: parsedState.equipe || defaultState.equipe,
        };
        return mergedState as State;
      }
    } catch (error) {
      console.error('Failed to parse form data from localStorage', error);
      return defaultState;
    }
  }
  return defaultState;
};

// --- Provider Component ---
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(state));
  }, [state]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// --- Hook customizado ---
export const useFormState = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormProvider');
  }
  return context;
};