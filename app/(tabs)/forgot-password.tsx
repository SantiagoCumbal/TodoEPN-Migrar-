import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { createStyles, defaultDarkTheme, defaultLightTheme } from '@/src/presentation/styles/todos.styles';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const { sendPasswordReset, loading, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? defaultDarkTheme : defaultLightTheme;
  const themeStyles = createStyles(theme);

  const handleSend = async () => {
    const trimmed = email.trim();
    if (!trimmed) { Alert.alert('Error', 'Ingresa un email'); return; }
    // Validar formato simple antes de llamar al backend
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) { Alert.alert('Error', 'El formato del email no es válido'); return; }

    const ok = await sendPasswordReset(trimmed);
    if (ok) {
      Alert.alert('Enviado', 'Revisa tu correo para restablecer la contraseña');
      // No navegar automáticamente al login: permitir al usuario leer el mensaje
      setEmail('');
    } else {
      // Mostrar mensaje de error más específico si el hook lo entregó
      Alert.alert('Error', error || 'No se pudo enviar el email de recuperación');
    }
  };

  return (
    <View style={styles.container}>
  <View style={[themeStyles.header, { marginBottom: 16, paddingVertical: 26, minHeight: 108 }]}> 
        <TouchableOpacity onPress={() => router.back()} style={{ paddingVertical: 6, paddingHorizontal: 8, marginRight: 8 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[themeStyles.title, { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 20, top: 34 }]}>Recuperar contraseña</Text>
      </View>
      <Text style={styles.info}>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSend} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#f5f5f5' },
  title: { fontSize:24, fontWeight:'700', marginBottom:10 },
  info: { color:'#666', marginBottom:20 },
  input: { backgroundColor:'#fff', padding:12, borderRadius:8, marginBottom:12 },
  button: { backgroundColor:'#007AFF', padding:14, borderRadius:8, alignItems:'center' },
  buttonDisabled: { backgroundColor: '#999' },
  buttonText: { color:'#fff', fontWeight:'700' },
});
