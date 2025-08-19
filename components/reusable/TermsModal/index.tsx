import React from 'react';
import { Text, View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, onAccept }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Termos de Uso e LGPD</Text>
        <ScrollView style={styles.modalScrollView}>
          <Text style={styles.modalText}>
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
            {"\n\n"}
            Seus dados pessoais, como informações de contato e perfil de saúde, serão coletados e armazenados de forma segura em nossa plataforma. Estes dados serão utilizados exclusivamente para conectar você a estudos e pesquisas científicas compatíveis com seu perfil.
            {"\n\n"}
            As informações poderão ser compartilhadas de forma anonimizada com pesquisadores responsáveis pelos estudos. Garantimos a confidencialidade e a segurança dos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            {"\n\n"}
            Você pode solicitar a exclusão dos seus dados a qualquer momento através do seu perfil.
          </Text>
        </ScrollView>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={[styles.modalButton, styles.rejectButton]} onPress={onClose}>
            <Text style={styles.modalButtonText}>Rejeitar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.acceptButton]} onPress={onAccept}>
            <Text style={styles.modalButtonText}>Aceitar e Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  modalScrollView: {
    width: '100%',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#6c757d',
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: '#15715A',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});