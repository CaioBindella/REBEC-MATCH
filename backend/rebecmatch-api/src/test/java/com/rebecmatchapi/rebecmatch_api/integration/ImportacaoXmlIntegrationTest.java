package com.rebecmatchapi.rebecmatch_api.integration;

import com.rebecmatchapi.rebecmatch_api.entity.Doenca;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.GeneroElegivel;
import com.rebecmatchapi.rebecmatch_api.repository.DoencaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import com.rebecmatchapi.rebecmatch_api.service.EstudoService;
import com.rebecmatchapi.rebecmatch_api.service.XmlProcessingService;
import com.rebecmatchapi.rebecmatch_api.service.XmlProcessingService.ResumoImportacao;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Importação de um extrato no formato ICTRP com as variações reais encontradas no ReBEC:
 * status em minúsculas, códigos de sexo "F" e "B", limite etário "0" sem unidade, código de
 * condição de saúde fora do vocabulário e ensaio sem contato científico.
 */
@SpringBootTest
@ActiveProfiles("test")
class ImportacaoXmlIntegrationTest {

    @Autowired
    private XmlProcessingService xmlProcessingService;
    @Autowired
    private EstudoRepository estudoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DoencaRepository doencaRepository;
    @Autowired
    private EstudoService estudoService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    void importaNormalizaEIgnoraEnsaiosJaCadastrados() throws Exception {
        String sufixo = UUID.randomUUID().toString().substring(0, 6);
        String codigo = "C18.452.394.750.149." + sufixo;
        doencaRepository.save(new Doenca(codigo, "Diabetes Mellitus, Type 2", "Diabetes tipo 2 " + sufixo, "DeCS"));
        String email = "contato." + sufixo + "@example.org";
        String xml = """
                <?xml version="1.0"?>
                <root><trials>
                  %s
                  %s
                  <trial><main><trial_id>RBR-c%s</trial_id><date_registration>01/02/2020</date_registration>
                    <public_title>Sem contato</public_title><scientific_title>Sem contato</scientific_title>
                    <recruitment_status>Recruiting</recruitment_status></main>
                    <contacts><contact><type>public</type><email>publico@example.org</email></contact></contacts>
                  </trial>
                </trials></root>
                """.formatted(
                ensaio("RBR-a" + sufixo, "recruiting", "F", "18Y", "0", email, codigo + "</hc_code><hc_code>X99.INEXISTENTE"),
                ensaio("RBR-b" + sufixo, "Recruiting", "B", "0", "65Y", email, "X98.INEXISTENTE"),
                sufixo);

        ResumoImportacao primeira = xmlProcessingService.processXml(xml);
        assertThat(primeira.total()).isEqualTo(3);
        assertThat(primeira.novos()).isEqualTo(2);
        assertThat(primeira.ignorados()).isEqualTo(1);
        assertThat(primeira.falhas()).isZero();
        assertThat(primeira.codigosDoencaNaoEncontrados()).isEqualTo(2);

        ResumoImportacao segunda = xmlProcessingService.processXml(xml);
        assertThat(segunda.novos()).isZero();
        assertThat(segunda.existentes()).isEqualTo(2);

        new TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            Estudo comRestricao = estudoPorTrialId("RBR-a" + sufixo);
            assertThat(comRestricao.getRecruitmentStatus()).isEqualTo("Recruiting");
            assertThat(comRestricao.getCriterios()).singleElement()
                    .satisfies(c -> assertThat(c.getGender()).isEqualTo(GeneroElegivel.FEMININO));
            assertThat(comRestricao.getDoencas()).extracting(Doenca::getCodigo).containsExactly(codigo);

            Estudo semRestricao = estudoPorTrialId("RBR-b" + sufixo);
            assertThat(semRestricao.getCriterios()).singleElement()
                    .satisfies(c -> assertThat(c.getGender()).isEqualTo(GeneroElegivel.AMBOS));
            // Os dois ensaios do mesmo contato científico ficam com o mesmo pesquisador
            assertThat(semRestricao.getPesquisador().getId()).isEqualTo(comRestricao.getPesquisador().getId());
            assertThat(comRestricao.getPesquisador().getNomeFicticio()).startsWith("PS").endsWith("RJ");
        });

        // A conta provisionada não pode ser acessada com o e-mail público do registro
        Usuario provisionado = usuarioRepository.findByEmail(email).orElseThrow();
        assertThat(passwordEncoder.matches(email, provisionado.getSenha())).isFalse();
        assertThat(provisionado.getCep()).isEqualTo("20040002");

        // Busca por doença: pelo vocabulário controlado e, sem código conhecido, pelo texto livre
        assertThat(estudoService.buscarEstudosPorDoenca("diabetes tipo 2 " + sufixo)).extracting(Estudo::getTrialId)
                .contains("RBR-a" + sufixo);
        assertThat(estudoService.buscarEstudosPorDoenca("Condição livre " + sufixo)).extracting(Estudo::getTrialId)
                .contains("RBR-a" + sufixo, "RBR-b" + sufixo);
    }

    private Estudo estudoPorTrialId(String trialId) {
        return estudoRepository.findAll().stream().filter(e -> e.getTrialId().equals(trialId)).findFirst().orElseThrow();
    }

    private static String ensaio(String trialId, String status, String genero, String idadeMin, String idadeMax,
                                 String email, String codigos) {
        String sufixo = trialId.substring(5);
        return """
                <trial>
                  <main>
                    <trial_id>%s</trial_id>
                    <date_registration>10/05/2021</date_registration>
                    <primary_sponsor>Universidade do Estado do Rio de Janeiro</primary_sponsor>
                    <public_title>Estudo %s</public_title>
                    <scientific_title>Ensaio %s</scientific_title>
                    <date_enrolment/>
                    <recruitment_status>%s</recruitment_status>
                    <url>https://ensaiosclinicos.gov.br/rg/%s</url>
                    <study_type>Intervention</study_type>
                    <phase>3</phase>
                    <hc_freetext>Condição livre %s</hc_freetext>
                    <i_freetext>Intervenção</i_freetext>
                  </main>
                  <contacts>
                    <contact><type>scientific</type><firstname>Ana</firstname><lastname>Souza</lastname>
                      <address>Rua São Francisco Xavier, 524</address><city>Rio de Janeiro</city>
                      <zip>20040-002</zip><telephone>2123340000</telephone><email>%s</email></contact>
                  </contacts>
                  <criteria>
                    <inclusion_criteria>Inclusão</inclusion_criteria>
                    <agemin>%s</agemin>
                    <agemax>%s</agemax>
                    <gender>%s</gender>
                    <exclusion_criteria>Exclusão</exclusion_criteria>
                  </criteria>
                  <ethics_reviews><ethics_review><approval_date>01/03/2021</approval_date></ethics_review></ethics_reviews>
                  <health_condition_code><hc_code>%s</hc_code></health_condition_code>
                </trial>
                """.formatted(trialId, trialId, trialId, status, trialId, sufixo, email, idadeMin, idadeMax, genero, codigos);
    }
}
