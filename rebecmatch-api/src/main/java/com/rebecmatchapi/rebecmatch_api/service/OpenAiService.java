package com.rebecmatchapi.rebecmatch_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {

    private final WebClient webClient;

    @Value("${openai.ai.key}")
    private String openAiKey;

    @Value("${openai.api.url}")
    private String openAiApiUrl;

    public OpenAiService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String callChatCompletion(String userPrompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4.1-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "Você é um assistente que responde somente em JSON válido."),
                        Map.of("role", "user", "content", userPrompt)
                ),
                "temperature", 0.7
        );

        // Fazendo a requisição
        OpenAiResponse response = webClient.post()
                .uri(openAiApiUrl)
                .header("Authorization", "Bearer " + openAiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                        clientResponse -> clientResponse.statusCode().isError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Erro da API OpenAI: "
                                        + clientResponse.statusCode() + " - " + body))
                )
                .bodyToMono(OpenAiResponse.class)
                .block();

        // Acessa o conteúdo
        if (response != null && response.choices != null && !response.choices.isEmpty()) {
            return response.choices.get(0).message.content;
        }
        return null;
    }

    // Classes auxiliares para mapear a resposta da API
    public static class OpenAiResponse {
        public List<Choice> choices;
    }

    public static class Choice {
        public Message message;
    }

    public static class Message {
        public String role;
        public String content;
    }
}
