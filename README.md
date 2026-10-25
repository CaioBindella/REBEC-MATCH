# ReBEC-Match — Vocabulário de doenças (branch `doencas`)

Scripts e dados que produzem o **vocabulário controlado de condições de saúde** (DeCS/CID-10) usado
na busca de estudos por doença. A tabela `doencas` relaciona cada código do vocabulário ao nome
científico e a um nome popular.

## Fluxo

```
repository_descriptor_all.csv          descritores DeCS/CID-10 (text, aspects, vocabularies, codes)
        │  gerar_nomes_populares.py    sugere um nome popular para cada descritor (OpenAI)
        ▼
doencas_com_nomes_populares.xlsx       descritores + coluna "Nomes Populares"
        │  import_doencas.py           grava cada código na tabela doencas (INSERT IGNORE)
        ▼
tabela doencas (MySQL/MariaDB)
```

Na API principal (branch `java-api`), essa mesma carga está versionada como migração Flyway
(`V11__RebecMatch-doencas.sql`), gerada a partir de `doencas_com_nomes_populares.xlsx`. Assim, um
banco novo já recebe o vocabulário sem executar estes scripts. Eles servem para **regenerar ou
atualizar** a planilha e a carga.

## Uso

```bash
pip install -r requirements.txt

# 1. Gerar/atualizar os nomes populares (retoma de onde parou, salvando o progresso em infos.xlsx)
export OPENAI_API_KEY=...            # nunca escreva a chave no código
python gerar_nomes_populares.py

# 2. Carregar a planilha no banco
export DB_HOST=localhost DB_NAME=match_v2 DB_USER=root DB_PASSWORD=...
python import_doencas.py
```

Os nomes populares gerados automaticamente servem apenas para melhorar a busca do voluntário. O
código e o nome científico continuam sendo os do vocabulário oficial.
