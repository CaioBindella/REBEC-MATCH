import pandas as pd
import mysql.connector
from mysql.connector import Error
import os
import sys

# --- CONFIGURAÇÕES ---
ARQUIVO_EXCEL = 'doencas_com_nomes_populares.xlsx'
NOME_ABA = 'Sheet1'

# Configuração do Banco de Dados
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'database': os.environ.get('DB_NAME', 'match_v2'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
}

def conectar_banco():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Erro de Conexão MySQL: {e}")
        return None

def main():
    print("--- INICIANDO IMPORTAÇÃO DIRETO DO EXCEL (.xlsx) ---")
    
    # 1. Ler o Excel
    try:
        print(f"Lendo arquivo: {ARQUIVO_EXCEL}...")
        
        # Lê o Excel forçando tudo como string para evitar que códigos como "001" virem 1
        df = pd.read_excel(ARQUIVO_EXCEL, sheet_name=NOME_ABA, dtype=str, engine='openpyxl')
        
        # Remove espaços dos nomes das colunas (ex: " text " vira "text")
        df.columns = df.columns.str.strip()
        
        # Remove linhas vazias
        df.dropna(how='all', inplace=True)
        df.fillna('', inplace=True)
        
        print(f"Excel lido com sucesso! Linhas: {len(df)}")
        print(f"Colunas detectadas: {list(df.columns)}")
        
    except Exception as e:
        print(f"ERRO AO LER EXCEL: {e}")
        return

    # 2. Conectar ao Banco
    conn = conectar_banco()
    if not conn:
        return
    cursor = conn.cursor()

    # 3. Inserção
    total_inseridos = 0
    total_ignorados = 0
    erros = 0
    
    # Verifica o nome da tabela (geralmente 'doenca' se criado pelo Hibernate/JPA)
    nome_tabela = 'doencas' 
    
    sql_insert = f"""
    INSERT IGNORE INTO {nome_tabela} (codigo, nome_cientifico, nome_popular, vocabulario)
    VALUES (%s, %s, %s, %s)
    """

    print(f"Iniciando gravação na tabela '{nome_tabela}'...")

    for index, row in df.iterrows():
        try:
            # --- MAPEAMENTO DE COLUNAS ---
            # Ajuste os nomes abaixo conforme aparecem no print "Colunas detectadas"
            
            # Nome Científico (coluna 'text')
            nome_cientifico = row.get('text', '').strip()
            
            # Vocabulário (ICD-10, DeCS...)
            vocabulario = row.get('vocabularies', '').strip()
            
            # Códigos (pode ter vários separados por vírgula)
            raw_codes = row.get('codes', '').strip()
            
            # Nome Popular (coluna 'Nomes Populares')
            nome_popular = row.get('Nomes Populares', '').strip()

            # --- TRATAMENTOS ---
            
            # Se não tiver código, pula
            if not raw_codes or raw_codes.lower() == 'nan':
                continue

            # Fallback: Se não tem nome popular, usa o científico
            if not nome_popular or nome_popular.lower() == 'nan' or nome_popular.upper() == 'N/A':
                nome_popular = nome_cientifico

            # Separa códigos múltiplos (ex: "D01, D02")
            # Substitui ponto e vírgula por vírgula apenas por garantia
            raw_codes = raw_codes.replace(';', ',')
            lista_codigos = [c.strip() for c in raw_codes.split(',')]

            for codigo in lista_codigos:
                if not codigo:
                    continue
                
                # Prepara dados e insere
                val = (codigo, nome_cientifico, nome_popular, vocabulario)
                cursor.execute(sql_insert, val)
                
                if cursor.rowcount > 0:
                    total_inseridos += 1
                else:
                    total_ignorados += 1

        except Error as e:
            print(f"Erro SQL (Linha {index}): {e}")
            erros += 1
        except Exception as e:
            # Ignora erros de dados sujos
            continue

    # 4. Finalizar
    conn.commit()
    cursor.close()
    conn.close()

    print("\n--- RELATÓRIO FINAL ---")
    print(f"Sucesso (Inseridos): {total_inseridos}")
    print(f"Duplicados (Já existiam): {total_ignorados}")
    print(f"Erros: {erros}")

if __name__ == "__main__":
    main()