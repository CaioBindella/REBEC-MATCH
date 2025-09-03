package com.rebecmatchapi.rebecmatch_api.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class XmlScheduler {

    private static final Logger logger = LoggerFactory.getLogger(XmlScheduler.class);
    private final XmlProcessingService xmlProcessingService;

    // URL do XML a ser processado
    private static final String XML_URL = "https://raw.githubusercontent.com/CaioBindella/REBEC-MATCH/refs/heads/xml/RBR-ictrp-ALL.xml";

    /**
     * Executa a tarefa de processamento do XML semanalmente.
     * A expressão cron "0 0 0 * * SUN" significa: "às 00:00:00 toda segunda-feira".
     * Para teste, usar "0 * * * * *" para rodar a cada minuto.
     */
    @Scheduled(cron = "0 * * * * *")
    public void scheduleXmlProcessing() {
        logger.info("Starting scheduled XML processing task...");
        xmlProcessingService.processXmlFromUrl(XML_URL);
        logger.info("Finished scheduled XML processing task.");
    }
}