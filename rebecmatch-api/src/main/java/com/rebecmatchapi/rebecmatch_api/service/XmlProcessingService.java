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
import java.util.List;
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
                    if (trial.getMain() != null && !estudoRepository.existsByTrialId(trial.getMain().getTrialId())) {
                        logger.info("New trial found: {}. Processing...", trial.getMain().getTrialId());
                        saveNewTrial(trial);
                    } else {
                        logger.info("Trial with ID {} already exists or has no main data. Skipping.", trial.getTrialId());
                    }
                }
            }
            logger.info("Finished processing all trials from XML.");
        } catch (Exception e) {
            logger.error("Failed to process XML from URL: " + url, e);
        }
    }

    private void saveNewTrial(Trial trial) {
        // 1. Criar ou encontrar o Pesquisador
        Pesquisador pesquisador = createOrFindPesquisador(trial.getScientificContact());
        if (pesquisador == null) {
            logger.warn("Could not create or find researcher for trial {}. Skipping trial.", trial.getMain().getTrialId());
            return;
        }

        // 2. Criar o Estudo
        Estudo novoEstudo = new Estudo();
        novoEstudo.setTrialId(trial.getMain().getTrialId());
        novoEstudo.setPublicTitle(trial.getMain().getPublicTitle());
        novoEstudo.setScientificTitle(trial.getMain().getScientificTitle());
        novoEstudo.setRecruitmentStatus(trial.getMain().getRecruitmentStatus());
        novoEstudo.setStudyType(trial.getMain().getStudyType());
        novoEstudo.setPhase(trial.getMain().getPhase());
        novoEstudo.setUrl(trial.getMain().getUrl());
        novoEstudo.setPrimarySponsor(trial.getMain().getPrimarySponsor());
        novoEstudo.setHcFreetext(trial.getMain().getHcFreeText());
        novoEstudo.setIFreetext(trial.getMain().getIFreeText());
        novoEstudo.setPesquisador(pesquisador);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        if (trial.getMain().getDateRegistration() != null && !trial.getMain().getDateRegistration().isEmpty()) {
            novoEstudo.setDateRegistration(LocalDate.parse(trial.getMain().getDateRegistration(), formatter));
        }
        if (trial.getMain().getDateEnrolment() != null && !trial.getMain().getDateEnrolment().isEmpty()) {
            novoEstudo.setDateEnrolment(LocalDate.parse(trial.getMain().getDateEnrolment(), formatter));
        }

        if (trial.getEthicsReviews() != null && !trial.getEthicsReviews().isEmpty()) {
            novoEstudo.setApprovalDate(trial.getEthicsReviews().get(0).getApprovalDate());
        }

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
            criterio.setEstudo(novoEstudo);
            novoEstudo.setCriterios(List.of(criterio));
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
            Usuario novoUsuario = new Usuario();
            novoUsuario.setNome(contact.getFirstname());
            novoUsuario.setSobrenome(contact.getLastname());
            novoUsuario.setEmail(contact.getEmail());
            novoUsuario.setLogin(contact.getEmail());
            novoUsuario.setTelefone(contact.getTelephone());
            novoUsuario.setTipoEspecifico(TipoEspecifico.PESQUISADOR);
            novoUsuario.setSenha(passwordEncoder.encode(contact.getEmail()));
            novoUsuario.setCep(contact.getZip());
            novoUsuario.setEndereco(String.format("%s, %s", contact.getAddress(), contact.getCity()));

            Usuario savedUsuario = usuarioRepository.save(novoUsuario);

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