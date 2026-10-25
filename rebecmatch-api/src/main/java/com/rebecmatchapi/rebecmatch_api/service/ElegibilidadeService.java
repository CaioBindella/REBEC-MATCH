package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Filtragem baseada em regras sobre os critérios estruturados de elegibilidade de um estudo:
 * idade mínima, idade máxima e sexo.
 * <p>
 * Os limites etários seguem o formato da ICTRP, um número seguido da unidade: Y (anos), M (meses),
 * W (semanas), D (dias) ou H (horas). O extrato do ReBEC também traz valores sem unidade; nesse caso
 * o número é interpretado em anos, e o valor zero (com ou sem unidade) significa ausência de limite.
 * Campos vazios também significam ausência de limite.
 */
@Service
public class ElegibilidadeService {

    /** Quantidade de critérios estruturados avaliados para cada critério de um estudo. */
    public static final int CRITERIOS_ESTRUTURADOS = 3;

    private static final Pattern FORMATO_IDADE = Pattern.compile("^(\\d+)\\s*([A-Za-z]*)$");

    /** Limite etário interpretado: um valor inteiro expresso em uma unidade de tempo. */
    public record LimiteIdade(long valor, ChronoUnit unidade) {
    }

    /** Resultado da avaliação de um critério para um voluntário. */
    public record ResultadoElegibilidade(boolean idadeMinima, boolean idadeMaxima, boolean sexo) {
        public int criteriosAtendidos() {
            return (idadeMinima ? 1 : 0) + (idadeMaxima ? 1 : 0) + (sexo ? 1 : 0);
        }

        public boolean elegivel() {
            return idadeMinima && idadeMaxima && sexo;
        }
    }

    /**
     * Interpreta um limite etário.
     *
     * @return vazio quando não há limite (campo vazio ou valor zero).
     * @throws IllegalArgumentException quando o texto não segue nenhum formato reconhecido.
     */
    public Optional<LimiteIdade> interpretarIdade(String texto) {
        if (texto == null || texto.isBlank()) {
            return Optional.empty();
        }
        Matcher matcher = FORMATO_IDADE.matcher(texto.trim());
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Formato de idade não reconhecido: " + texto);
        }
        long valor = Long.parseLong(matcher.group(1));
        ChronoUnit unidade = unidadeDe(matcher.group(2));
        if (valor == 0) {
            return Optional.empty();
        }
        return Optional.of(new LimiteIdade(valor, unidade));
    }

    /** Indica se o texto é um limite etário válido (usado na validação do cadastro de critérios). */
    public boolean idadeValida(String texto) {
        try {
            interpretarIdade(texto);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private ChronoUnit unidadeDe(String sufixo) {
        return switch (sufixo.toUpperCase()) {
            case "", "Y", "YEAR", "YEARS", "A", "ANO", "ANOS" -> ChronoUnit.YEARS;
            case "M", "MONTH", "MONTHS", "MES", "MESES" -> ChronoUnit.MONTHS;
            case "W", "WEEK", "WEEKS", "S", "SEMANA", "SEMANAS" -> ChronoUnit.WEEKS;
            case "D", "DAY", "DAYS", "DIA", "DIAS" -> ChronoUnit.DAYS;
            case "H", "HOUR", "HOURS", "HORA", "HORAS" -> ChronoUnit.HOURS;
            default -> throw new IllegalArgumentException("Unidade de idade não reconhecida: " + sufixo);
        };
    }

    /**
     * Avalia um critério para um voluntário com a data de nascimento e o sexo informados.
     * Um voluntário sem data de nascimento não atende aos limites etários que existirem; um limite
     * em formato irreconhecível também não é considerado atendido (falso negativo, nunca falso positivo).
     */
    public ResultadoElegibilidade avaliar(Criterio criterio, LocalDate dataNascimento, Sexo sexo, LocalDate hoje) {
        boolean idadeMinimaOk = atendeLimite(criterio.getAgeMin(), dataNascimento, hoje, true);
        boolean idadeMaximaOk = atendeLimite(criterio.getAgeMax(), dataNascimento, hoje, false);
        boolean sexoOk = criterio.getGender() != null && criterio.getGender().aceita(sexo);
        return new ResultadoElegibilidade(idadeMinimaOk, idadeMaximaOk, sexoOk);
    }

    /**
     * Avalia todos os critérios de um estudo e devolve o melhor resultado (o critério com mais
     * condições atendidas). Um estudo é compatível se ao menos um de seus critérios for integralmente
     * atendido. Estudos sem critério cadastrado não produzem resultado.
     */
    public Optional<ResultadoElegibilidade> melhorResultado(List<Criterio> criterios, LocalDate dataNascimento,
                                                            Sexo sexo, LocalDate hoje) {
        if (criterios == null || criterios.isEmpty()) {
            return Optional.empty();
        }
        return criterios.stream()
                .map(c -> avaliar(c, dataNascimento, sexo, hoje))
                .max(Comparator.comparingInt(ResultadoElegibilidade::criteriosAtendidos));
    }

    private boolean atendeLimite(String texto, LocalDate dataNascimento, LocalDate hoje, boolean minimo) {
        Optional<LimiteIdade> limite;
        try {
            limite = interpretarIdade(texto);
        } catch (IllegalArgumentException e) {
            return false;
        }
        if (limite.isEmpty()) {
            return true;
        }
        if (dataNascimento == null) {
            return false;
        }
        long idade = idadeEm(limite.get().unidade(), dataNascimento, hoje);
        return minimo ? idade >= limite.get().valor() : idade <= limite.get().valor();
    }

    private long idadeEm(ChronoUnit unidade, LocalDate dataNascimento, LocalDate hoje) {
        if (unidade == ChronoUnit.HOURS) {
            return ChronoUnit.DAYS.between(dataNascimento, hoje) * 24;
        }
        return unidade.between(dataNascimento, hoje);
    }
}
