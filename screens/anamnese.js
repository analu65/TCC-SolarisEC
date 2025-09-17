import { View, Text, StyleSheet } from "react-native";
import CardAnamnese from "../components/CardAnamnese";

export default function Anamnese() {
  const userId = "HfQkXh5kZWUndIlXxQMASb6aX4X2";

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ficha de Anamnese</Text>
      <CardAnamnese 
        userId={userId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7EBE6',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#3d2f49',
  },
});