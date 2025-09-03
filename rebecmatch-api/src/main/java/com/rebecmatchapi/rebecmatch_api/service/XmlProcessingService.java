package com.rebecmatchapi.rebecmatch_api.service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Xml.Trial;
import com.rebecmatchapi.rebecmatch_api.dto.Xml.Trials;
import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class XmlProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(XmlProcessingService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private EstudoRepository estudoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PesquisadorRepository pesquisadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CepService cepService;

    @Transactional
    public void processXmlFromUrl(String url) {
        try {
            String xmlContent = restTemplate.getForObject(url, String.class);
            XmlMapper xmlMapper = new XmlMapper();
            Trials trialsWrapper = xmlMapper.readValue(xmlContent, Trials.class);

            if (trialsWrapper != null && trialsWrapper.getTrials() != null) {
                for (Trial trial : trialsWrapper.getTrials()) {
                    // Verifica se o estudo já existe pelo trial_id antes de processar
                    if (!estudoRepository.existsByTrialId(trial.getTrialId())) {
                        logger.info("New trial found: {}. Processing...", trial.getTrialId());
                        saveNewTrial(trial);
                    } else {
                        logger.info("Trial with ID {} already exists. Skipping.", trial.getTrialId());
                    }
                }
            }
            logger.info("Finished processing all trials from XML.");
        } catch (Exception e) {
            logger.error("Failed to process XML from URL: " + url, e);
        }
    }

    private void saveNewTrial(Trial trial) {
        // 1. Criar ou encontrar o Pesquisador (Usuário)
        Pesquisador pesquisador = createOrFindPesquisador(trial.getScientificContact());
        if (pesquisador == null) {
            logger.warn("Could not create or find researcher for trial {}. Skipping trial.", trial.getTrialId());
            return;
        }

        // 2. Criar o Estudo
        Estudo novoEstudo = new Estudo();
        novoEstudo.setTrialId(trial.getTrialId());
        novoEstudo.setPublicTitle(trial.getPublicTitle());
        novoEstudo.setScientificTitle(trial.getScientificTitle());
        novoEstudo.setRecruitmentStatus(trial.getRecruitmentStatus());
        novoEstudo.setStudyType(trial.getStudyType());
        novoEstudo.setPhase(trial.getPhase());
        novoEstudo.setUrl(trial.getUrl());
        novoEstudo.setPrimarySponsor(trial.getPrimarySponsor());
        novoEstudo.setHcFreeText(trial.getHcFreeText());
        novoEstudo.setIFreeText(trial.getIFreeText());
        novoEstudo.setPesquisador(pesquisador);

        // Formatar datas
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        if (trial.getDateRegistration() != null && !trial.getDateRegistration().isEmpty()) {
            novoEstudo.setDateRegistration(LocalDate.parse(trial.getDateRegistration(), formatter));
        }
        if (trial.getDateEnrolment() != null && !trial.getDateEnrolment().isEmpty()) {
            novoEstudo.setDateEnrolment(LocalDate.parse(trial.getDateEnrolment(), formatter));
        }

        // Verifica se a lista de ethicsReviews não é nula nem vazia antes de aceder
        if (trial.getEthicsReviews() != null && !trial.getEthicsReviews().isEmpty()) {
            novoEstudo.setApprovalDate(trial.getEthicsReviews().get(0).getApprovalDate());
        }

        // Verifica se a lista de secondaryIds não é nula nem vazia antes de aceder
        if (trial.getSecondaryIds() != null && !trial.getSecondaryIds().isEmpty()) {
            novoEstudo.setSecId(trial.getSecondaryIds().get(0).getSecId());
        }


        // 3. Criar o Critério
        if (trial.getCriteria() != null) {
            Criterio criterio = new Criterio();
            criterio.setInclusionCriteria(trial.getCriteria().getInclusionCriteria());
            criterio.setAgeMin(trial.getCriteria().getAgeMin());
            criterio.setAgeMax(trial.getCriteria().getAgeMax());
            criterio.setGender(trial.getCriteria().getGender());
            criterio.setExclusionCriteria(trial.getCriteria().getExclusionCriteria());
            criterio.setEstudo(novoEstudo); // Associa o critério ao estudo
            novoEstudo.setCriterios(criterio); // Associa o critério ao estudo
        }

        estudoRepository.save(novoEstudo);
        logger.info("Successfully saved new study with trial ID: {}", novoEstudo.getTrialId());
    }

    private Pesquisador createOrFindPesquisador(Trial.Contact contact) {
        if (contact == null || contact.getEmail() == null || contact.getEmail().isEmpty()) {
            return null;
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(contact.getEmail());

        if (usuarioExistente.isPresent()) {
            return usuarioExistente.get().getPesquisador();
        } else {
            // Cria um novo usuário e pesquisador
            Usuario novoUsuario = new Usuario();
            novoUsuario.setNome(contact.getFirstname());
            novoUsuario.setSobrenome(contact.getLastname());
            novoUsuario.setEmail(contact.getEmail());
            novoUsuario.setLogin(contact.getEmail()); // Usando email como login
            novoUsuario.setTelefone(contact.getTelephone());
            novoUsuario.setTipoEspecifico(TipoEspecifico.PESQUISADOR);
            novoUsuario.setSenha(passwordEncoder.encode(contact.getEmail())); // Senha padrão = email
            novoUsuario.setCep(contact.getZip());

            String endereco = String.format("%s, %s", contact.getAddress(), contact.getCity());
            novoUsuario.setEndereco(endereco);

            Usuario savedUsuario = usuarioRepository.save(novoUsuario);

            // A criação do pesquisador já acontece automaticamente no UsuarioService,
            // mas aqui precisamos garantir que ele seja criado se não existir.
            Pesquisador pesquisador = new Pesquisador();
            pesquisador.setUsuario(savedUsuario);
            pesquisador.setNomeFicticio(generateFictionalName(savedUsuario));

            return pesquisadorRepository.save(pesquisador);
        }
    }

    private String generateFictionalName(Usuario usuario) {
        String prefix = usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR ? "PS" : "VOL";
        String idPart = String.valueOf(usuario.getId());
        String suffix = cepService.getStateAbbreviation(usuario.getCep());
        return prefix + idPart + suffix;
    }
}

