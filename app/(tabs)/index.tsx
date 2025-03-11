import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('@/assets/img/logo_horizontal.png')} style={styles.logo} />
        <Text style={styles.title}>Encuesta de Calificación de Servicio</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/CalificacionScreen')}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.version}>V.0.1</Text>
        <Text style={styles.developedBy}>Desarrollado por Sistemas Tambini</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Color hueso en todo el fondo
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  version: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  developedBy: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
