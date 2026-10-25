import pandas as pd
from openai import OpenAI
import time
import os

# --- CONFIGURAÇÃO ---
# Chave da API da OpenAI lida da variável de ambiente OPENAI_API_KEY (nunca escrita no código)
SUA_CHAVE_API = os.environ.get("OPENAI_API_KEY", "")

ARQUIVO_ENTRADA = 'repository_descriptor_all.csv'
ARQUIVO_SAIDA = 'doencas_com_nomes_populares.xlsx'
ARQUIVO_INFOS = 'infos.xlsx'

def obter_nome_popular(texto, vocabulario, codigos, cliente):
    if not texto or pd.isna(texto):
        return "Termo vazio"
    
    codigos_str = str(codigos) if pd.notna(codigos) else "N/A"
    vocabulario_str = str(vocabulario) if pd.notna(vocabulario) else "N/A"

    try:
        prompt = f"""
        Considerando a seguinte informação de um descritor de saúde:
        - Termo/Texto: "{texto}"
        - Vocabulário de Origem: "{vocabulario_str}"
        - Código(s) Associado(s): "{codigos_str}"

        Qual é o nome popular ou termo leigo para esta condição médica?
        Responda apenas com o nome popular. Se houver mais de um, separe por vírgula.
        Se não existir um nome popular conhecido, responda com "N/A".
        """
        
        resposta = cliente.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente especialista em terminologia médica para leigos."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=50
        )
        return resposta.choices[0].message.content.strip()
    except Exception as e:
        print(f"   -> Erro ao processar '{texto}': {e}")
        return "Erro na API"


# ---- INÍCIO DO SCRIPT ----
if __name__ == "__main__":
    if SUA_CHAVE_API == "COLE_AQUI_SUA_CHAVE_API" or SUA_CHAVE_API == "":
        print("ERRO: defina a variável de ambiente OPENAI_API_KEY.")
        exit()

    client = OpenAI(api_key=SUA_CHAVE_API)

    df_entrada = pd.read_csv(ARQUIVO_ENTRADA, sep=';', encoding='latin-1')
    COLUNA_CHAVE = 'text'

    if os.path.exists(ARQUIVO_SAIDA):
        print(f"Arquivo de saída '{ARQUIVO_SAIDA}' encontrado. Lendo progresso...")
        df_saida = pd.read_excel(ARQUIVO_SAIDA)
        df_saida = pd.merge(df_entrada, df_saida, on=COLUNA_CHAVE, how='left', suffixes=('', '_antigo'))
        colunas_para_remover = [col for col in df_saida.columns if col.endswith('_antigo')]
        df_saida = df_saida.drop(columns=colunas_para_remover)
    else:
        print(f"Arquivo de saída '{ARQUIVO_SAIDA}' não encontrado. Começando do zero.")
        df_saida = df_entrada.copy()
        df_saida['Nomes Populares'] = pd.NA

    total_linhas = len(df_saida)

    # ---- Controle via infos.xlsx ----
    if os.path.exists(ARQUIVO_INFOS):
        df_infos = pd.read_excel(ARQUIVO_INFOS)
        if not df_infos.empty and 'linha_inicio' in df_infos.columns:
            linha_inicio = int(df_infos.loc[0, 'linha_inicio'])
            print(f"Retomando a partir da linha {linha_inicio} (conforme {ARQUIVO_INFOS})...")
        else:
            linha_inicio = 0
    else:
        linha_inicio = 0
        df_infos = pd.DataFrame({'linha_inicio': [linha_inicio], 'ultima_lida': [0]})
        df_infos.to_excel(ARQUIVO_INFOS, index=False)

    for index, row in df_saida.iterrows():
        if index < linha_inicio:
            continue  # Pula até chegar na linha definida em infos.xlsx

        if pd.notna(row.get('Nomes Populares')):
            continue

        termo_texto = row['text']
        termo_vocabulario = row['vocabularies']
        termo_codigos = row['codes']

        print(f"Processando linha {index + 1}/{total_linhas}: {termo_texto}")
        nome_popular = obter_nome_popular(termo_texto, termo_vocabulario, termo_codigos, client)
        df_saida.at[index, 'Nomes Populares'] = nome_popular
        print(f"   -> Resultado: {nome_popular}")

        # Atualiza infos.xlsx com a última linha processada
        df_infos.loc[0, 'ultima_lida'] = index
        df_infos.to_excel(ARQUIVO_INFOS, index=False)

        time.sleep(0.5)

        if (index + 1) % 20 == 0:
            print(f"\n--- Salvando progresso parcial ({index + 1} linhas verificadas) ---\n")
            df_saida.to_excel(ARQUIVO_SAIDA, index=False)

    print(f"\nProcessamento concluído! Salvando resultado final em '{ARQUIVO_SAIDA}'...")
    df_saida.to_excel(ARQUIVO_SAIDA, index=False)

    # Atualiza infos.xlsx para próxima execução
    df_infos.loc[0, 'linha_inicio'] = df_infos.loc[0, 'ultima_lida'] + 1
    df_infos.to_excel(ARQUIVO_INFOS, index=False)

    print("Arquivo salvo com sucesso!")