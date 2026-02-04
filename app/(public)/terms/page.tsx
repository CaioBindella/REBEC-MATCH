import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfScienceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#15715A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Ciência e Uso</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.intro}>
          Bem-vindo ao <Text style={styles.bold}>RebecMatch</Text>. Ao utilizar nossa plataforma para se voluntariar ou conduzir pesquisas, você concorda com os termos descritos abaixo.
        </Text>

        {/* Seção 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Propósito da Plataforma</Text>
          <Text style={styles.paragraph}>
            O RebecMatch é uma ferramenta tecnológica desenvolvida para facilitar a conexão entre pesquisadores acadêmicos/científicos e voluntários dispostos a participar de estudos clínicos e sociais.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 10 }]}>
            <Text style={styles.bold}>Não somos uma clínica médica.</Text> O aplicativo não fornece diagnósticos, tratamentos ou aconselhamento médico direto.
          </Text>
        </View>

        {/* Seção 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Veracidade das Informações</Text>
          <Text style={styles.paragraph}>
            A integridade científica depende da honestidade dos dados:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Voluntários:</Text> Comprometem-se a fornecer informações verdadeiras sobre seu estado de saúde, histórico médico e dados demográficos. A criação de perfis com dados falsos para obter vantagens ou prejudicar estudos é estritamente proibida.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Pesquisadores:</Text> Devem representar instituições legítimas e possuir as devidas aprovações éticas (CEP/CONEP) para seus estudos.
            </Text>
          </View>
        </View>

        {/* Seção 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Proteção de Dados e Privacidade</Text>
          <Text style={styles.paragraph}>
            Levamos a LGPD (Lei Geral de Proteção de Dados) a sério.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 10 }]}>
            Seus dados sensíveis são armazenados de forma segura. O compartilhamento com pesquisadores ocorre apenas após o "Match" (aceite mútuo) para fins exclusivos da realização do estudo. É proibido aos pesquisadores compartilhar dados dos voluntários com terceiros sem consentimento explícito.
          </Text>
        </View>

        {/* Seção 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Conduta e Medidas de Segurança</Text>
          <Text style={styles.paragraph}>
            Para garantir um ambiente seguro, as seguintes ações resultarão no banimento imediato da conta:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>Uso de scripts, robôs ou "scrapers" para coletar dados da plataforma.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>Assédio, discurso de ódio ou comportamento abusivo no chat.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>Tentativa de vender produtos ou serviços através do sistema de mensagens.</Text>
          </View>
        </View>

        {/* Seção 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Isenção de Responsabilidade</Text>
          <Text style={styles.paragraph}>
            O RebecMatch atua apenas como intermediador. Não nos responsabilizamos por:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.text}>Resultados dos estudos ou eficácia de tratamentos testados.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.text}>Cancelamento de estudos por parte dos pesquisadores.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.text}>Informações falsas prestadas por usuários.</Text>
          </View>
        </View>

        {/* Texto Final */}
        <View style={styles.lastSection}>
          <Text style={styles.paragraph}>
            Ao clicar em "Aceito", você confirma que leu e compreendeu estes termos e concorda em agir com ética e transparência dentro da comunidade científica do RebecMatch.
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Entendi e Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15715A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 25,
  },
  lastSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#161C2D',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
    flex: 1, // Garante que o texto ocupe o espaço restante na linha do bullet
  },
  paragraph: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 5,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 18,
    color: '#15715A',
    marginRight: 10,
    fontWeight: 'bold',
    marginTop: -2, // Ajuste fino para alinhar o bullet com a primeira linha
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});