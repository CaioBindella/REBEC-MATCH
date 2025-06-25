import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type InitialButtonProps = {
  text: string;
  color?: string;
  onPress?: () => void;
};

export function InitialButton({ text, color = '#166865', onPress }: InitialButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '75%',
    padding: 13,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
