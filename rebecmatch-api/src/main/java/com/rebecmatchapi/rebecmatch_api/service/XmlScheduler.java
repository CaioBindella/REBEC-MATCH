package com.rebecmatchapi.rebecmatch_api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Agenda a importação dos ensaios do ReBEC/ICTRP: semanalmente (por padrão, todo domingo à meia-noite)
 * e, opcionalmente, uma vez logo após a inicialização da aplicação, para que um banco recém-criado
 * não precise aguardar o primeiro domingo. Execuções simultâneas são evitadas.
 */
@Component
public class XmlScheduler {

    private static final Logger logger = LoggerFactory.getLogger(XmlScheduler.class);

    private final XmlProcessingService xmlProcessingService;
    private final String xmlUrl;
    private final boolean importarAoIniciar;
    private final AtomicBoolean emExecucao = new AtomicBoolean(false);

    public XmlScheduler(XmlProcessingService xmlProcessingService,
                        @Value("${rebecmatch.import.xml-url}") String xmlUrl,
                        @Value("${rebecmatch.import.on-startup:true}") boolean importarAoIniciar) {
        this.xmlProcessingService = xmlProcessingService;
        this.xmlUrl = xmlUrl;
        this.importarAoIniciar = importarAoIniciar;
    }

    @Scheduled(cron = "${rebecmatch.import.cron}")
    public void scheduleXmlProcessing() {
        executar();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void importarAoIniciar() {
        if (importarAoIniciar) {
            CompletableFuture.runAsync(this::executar);
        }
    }

    void executar() {
        if (!emExecucao.compareAndSet(false, true)) {
            logger.info("Importação do ReBEC já está em andamento; nova execução ignorada.");
            return;
        }
        try {
            logger.info("Iniciando importação do extrato do ReBEC: {}", xmlUrl);
            xmlProcessingService.processXmlFromUrl(xmlUrl);
        } catch (Exception e) {
            logger.error("Falha ao obter ou interpretar o extrato do ReBEC em {}", xmlUrl, e);
        } finally {
            emExecucao.set(false);
        }
    }
}
