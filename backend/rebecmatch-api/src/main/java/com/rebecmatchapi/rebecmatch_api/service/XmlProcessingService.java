package com.rebecmatchapi.rebecmatch_api.service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Xml.Trial;
import com.rebecmatchapi.rebecmatch_api.dto.Xml.Trials;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.entity.enums.GeneroElegivel;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusRecrutamento;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.repository.DoencaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Importação dos ensaios clínicos do extrato do ReBEC no formato ICTRP.
 * <p>
 * Para cada ensaio ainda não cadastrado (identificado pelo trial_id) são criados o Estudo, seu Critério
 * de elegibilidade e as associações com o vocabulário controlado de doenças. Cada ensaio é gravado em
 * uma transação própria, de modo que um registro inconsistente na fonte é contabilizado como falha
 * sem interromper a importação dos demais.
 */
@Service
public class XmlProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(XmlProcessingService.class);
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final int TAMANHO_ENDERECO = 255;

    private final RestTemplate restTemplate;
    private final EstudoRepository estudoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PesquisadorRepository pesquisadorRepository;
    private final DoencaRepository doencaRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioService usuarioService;
    private final TransactionTemplate transacaoPorEnsaio;
    private final XmlMapper xmlMapper = new XmlMapper();
    private final SecureRandom random = new SecureRandom();

    /** Contagens de uma execução da importação. */
    public record ResumoImportacao(int total, int novos, int existentes, int ignorados, int falhas,
                                   int codigosDoencaNaoEncontrados) {
    }

    public XmlProcessingService(RestTemplate restTemplate, EstudoRepository estudoRepository,
                                UsuarioRepository usuarioRepository, PesquisadorRepository pesquisadorRepository,
                                DoencaRepository doencaRepository, PasswordEncoder passwordEncoder,
                                UsuarioService usuarioService, PlatformTransactionManager transactionManager) {
        this.restTemplate = restTemplate;
        this.estudoRepository = estudoRepository;
        this.usuarioRepository = usuarioRepository;
        this.pesquisadorRepository = pesquisadorRepository;
        this.doencaRepository = doencaRepository;
        this.passwordEncoder = passwordEncoder;
        this.usuarioService = usuarioService;
        this.transacaoPorEnsaio = new TransactionTemplate(transactionManager);
    }

    public ResumoImportacao processXmlFromUrl(String url) throws IOException {
        String xmlContent = restTemplate.getForObject(url, String.class);
        if (xmlContent == null || xmlContent.isBlank()) {
            throw new IOException("O extrato XML em " + url + " está vazio.");
        }
        return processXml(xmlContent);
    }

    public ResumoImportacao processXml(String xmlContent) throws IOException {
        Trials trialsWrapper = xmlMapper.readValue(xmlContent, Trials.class);
        List<Trial> trials = trialsWrapper == null || trialsWrapper.getTrials() == null ? List.of() : trialsWrapper.getTrials();

        int novos = 0, existentes = 0, ignorados = 0, falhas = 0;
        AtomicInteger codigosNaoEncontrados = new AtomicInteger();

        for (Trial trial : trials) {
            String trialId = trial.getTrialId() == null ? null : trial.getTrialId().trim();
            if (trialId == null || trialId.isEmpty()) {
                ignorados++;
                continue;
            }
            if (estudoRepository.existsByTrialId(trialId)) {
                existentes++;
                continue;
            }
            try {
                Boolean salvo = transacaoPorEnsaio.execute(status -> salvarNovoEstudo(trial, trialId, codigosNaoEncontrados));
                if (Boolean.TRUE.equals(salvo)) {
                    novos++;
                } else {
                    ignorados++;
                }
            } catch (RuntimeException e) {
                falhas++;
                logger.warn("Falha ao importar o ensaio {}: {}", trialId, e.getMessage());
            }
        }

        ResumoImportacao resumo = new ResumoImportacao(trials.size(), novos, existentes, ignorados, falhas, codigosNaoEncontrados.get());
        logger.info("Importação do ReBEC concluída: {} ensaios no extrato, {} novos, {} já cadastrados, {} ignorados "
                        + "(sem identificador ou sem contato científico), {} falhas, {} códigos de condição de saúde fora do vocabulário.",
                resumo.total(), resumo.novos(), resumo.existentes(), resumo.ignorados(), resumo.falhas(),
                resumo.codigosDoencaNaoEncontrados());
        return resumo;
    }

    private boolean salvarNovoEstudo(Trial trial, String trialId, AtomicInteger codigosNaoEncontrados) {
        Optional<Pesquisador> pesquisador = obterPesquisador(trial.getScientificContact());
        if (pesquisador.isEmpty()) {
            logger.debug("Ensaio {} sem contato científico com e-mail utilizável. Ignorado.", trialId);
            return false;
        }

        Trial.Main main = trial.getMain();
        Estudo novoEstudo = new Estudo();
        novoEstudo.setTrialId(trialId);
        novoEstudo.setPesquisador(pesquisador.get());
        novoEstudo.setPublicTitle(texto(main.getPublicTitle()));
        novoEstudo.setScientificTitle(texto(main.getScientificTitle()));
        // O extrato mistura "Recruiting" e "recruiting": grava-se sempre o rótulo padronizado
        novoEstudo.setRecruitmentStatus(StatusRecrutamento.deTextoOuOutro(main.getRecruitmentStatus()).getRotulo());
        novoEstudo.setStudyType(texto(main.getStudyType()));
        novoEstudo.setPhase(texto(main.getPhase()));
        novoEstudo.setUrl(texto(main.getUrl()));
        novoEstudo.setPrimarySponsor(texto(main.getPrimarySponsor()));
        novoEstudo.setHcFreetext(texto(main.getHcFreeText()));
        novoEstudo.setIFreetext(texto(main.getIFreeText()));
        novoEstudo.setDateRegistration(LocalDate.parse(texto(main.getDateRegistration()), FORMATO_DATA));
        if (!texto(main.getDateEnrolment()).isEmpty()) {
            novoEstudo.setDateEnrolment(LocalDate.parse(main.getDateEnrolment().trim(), FORMATO_DATA));
        }
        if (trial.getEthicsReviews() != null && !trial.getEthicsReviews().isEmpty()) {
            novoEstudo.setApprovalDate(trial.getEthicsReviews().get(0).getApprovalDate());
        }
        if (trial.getSecondaryIds() != null && !trial.getSecondaryIds().isEmpty()) {
            novoEstudo.setSecId(trial.getSecondaryIds().get(0).getSecId());
        }

        // Classificação temática pelo vocabulário controlado (DeCS/CID-10). Códigos fora do vocabulário
        // são contabilizados no resumo; o estudo continua alcançável pela busca através do hc_freetext.
        if (trial.getHealthConditionCodes() != null) {
            for (String code : trial.getHealthConditionCodes()) {
                String codigo = texto(code);
                if (codigo.isEmpty()) {
                    continue;
                }
                doencaRepository.findByCodigo(codigo).ifPresentOrElse(novoEstudo::addDoenca, () -> {
                    codigosNaoEncontrados.incrementAndGet();
                    logger.debug("Código de condição de saúde {} do ensaio {} não consta no vocabulário.", codigo, trialId);
                });
            }
        }

        if (trial.getCriteria() != null) {
            Trial.Criteria origem = trial.getCriteria();
            Criterio criterio = new Criterio();
            criterio.setEstudo(novoEstudo);
            criterio.setInclusionCriteria(texto(origem.getInclusionCriteria()));
            criterio.setExclusionCriteria(texto(origem.getExclusionCriteria()));
            criterio.setAgeMin(texto(origem.getAgeMin()).toUpperCase());
            criterio.setAgeMax(texto(origem.getAgeMax()).toUpperCase());
            // "F"/"M" viram FEMININO/MASCULINO e as duas grafias de "sem restrição" ("-" e "B") viram AMBOS
            criterio.setGender(GeneroElegivel.normalizar(origem.getGender()));
            novoEstudo.setCriterios(List.of(criterio));
        }

        estudoRepository.save(novoEstudo);
        return true;
    }

    /**
     * Localiza o pesquisador pelo e-mail do contato científico ou provisiona uma nova conta para ele.
     * A conta provisionada recebe uma senha aleatória, desconhecida por qualquer pessoa: ela representa o
     * responsável registrado no ReBEC e não pode ser acessada com dados públicos do registro.
     */
    private Optional<Pesquisador> obterPesquisador(Trial.Contact contact) {
        if (contact == null || texto(contact.getEmail()).isEmpty()) {
            return Optional.empty();
        }
        String email = contact.getEmail().trim();

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(email);
        if (usuarioExistente.isPresent()) {
            Optional<Pesquisador> pesquisador = pesquisadorRepository.findByUsuarioId(usuarioExistente.get().getId());
            if (pesquisador.isEmpty()) {
                logger.warn("O e-mail do contato científico {} pertence a uma conta que não é de pesquisador.", email);
            }
            return pesquisador;
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(contact.getFirstname());
        novoUsuario.setSobrenome(contact.getLastname());
        novoUsuario.setEmail(email);
        novoUsuario.setLogin(email);
        novoUsuario.setTelefone(contact.getTelephone());
        novoUsuario.setTipoEspecifico(TipoEspecifico.PESQUISADOR);
        novoUsuario.setSenha(passwordEncoder.encode(senhaAleatoria()));
        String cep = texto(contact.getZip()).replaceAll("\\D", "");
        novoUsuario.setCep(cep.isEmpty() ? null : cep);
        novoUsuario.setEndereco(endereco(contact));

        Usuario salvo = usuarioRepository.save(novoUsuario);
        usuarioService.criarPerfil(salvo);
        return Optional.ofNullable(salvo.getPesquisador());
    }

    private String senhaAleatoria() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String endereco(Trial.Contact contact) {
        String endereco = String.join(", ", List.of(texto(contact.getAddress()), texto(contact.getCity())).stream()
                .filter(parte -> !parte.isEmpty())
                .toList());
        if (endereco.isEmpty()) {
            return null;
        }
        return endereco.length() > TAMANHO_ENDERECO ? endereco.substring(0, TAMANHO_ENDERECO) : endereco;
    }

    private static String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }
}
