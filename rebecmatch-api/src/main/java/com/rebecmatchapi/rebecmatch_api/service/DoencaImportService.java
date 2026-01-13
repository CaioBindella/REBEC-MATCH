package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Doenca;
import com.rebecmatchapi.rebecmatch_api.repository.DoencaRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@Service
public class DoencaImportService {

    private static final Logger logger = LoggerFactory.getLogger(DoencaImportService.class);

    @Autowired
    private DoencaRepository doencaRepository;

    @Transactional
    public void importCsv(String filePath) {
        logger.info("Iniciando importação de doenças do arquivo: {}", filePath);

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            boolean isFirstLine = true;
            int count = 0;

            while ((line = br.readLine()) != null) {
                if (isFirstLine) { isFirstLine = false; continue; } // Pula cabeçalho

                // Split simples considerando vírgula, mas cuidado com vírgulas dentro de aspas
                // Regex para separar por vírgula apenas se não estiver entre aspas
                String[] columns = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                if (columns.length >= 6) {
                    try {
                        // Limpa aspas extras que o CSV pode ter
                        String scientificName = columns[0].replace("\"", "").trim();
                        String vocabulary = columns[2].replace("\"", "").trim();
                        String rawCodes = columns[5].replace("\"", "").trim();

                        // Verifica se existe coluna de nome popular (índice 6)
                        String popularName = "N/A";
                        if (columns.length > 6) {
                            popularName = columns[6].replace("\"", "").trim();
                        }

                        if (popularName.isEmpty() || popularName.equalsIgnoreCase("N/A")) {
                            popularName = scientificName; // Fallback
                        }

                        // O campo codes pode ter múltiplos códigos (ex: "D01, D02")
                        String[] codes = rawCodes.split(",");

                        for (String code : codes) {
                            String cleanCode = code.trim();
                            if (!cleanCode.isEmpty() && !doencaRepository.existsByCodigo(cleanCode)) {
                                Doenca doenca = new Doenca(cleanCode, scientificName, popularName, vocabulary);
                                doencaRepository.save(doenca);
                                count++;
                            }
                        }
                    } catch (Exception e) {
                        logger.error("Erro ao processar linha: " + line, e);
                    }
                }
            }
            logger.info("Importação concluída. {} novas doenças cadastradas.", count);

        } catch (IOException e) {
            logger.error("Erro ao ler arquivo CSV", e);
        }
    }
}
